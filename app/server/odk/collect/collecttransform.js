'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
const xml2js = require('xml2js');
BPromise.promisifyAll(xml2js);
const log = require('app/server/util/logapp.js');
const dates = require('app/server/util/dates.js');
const datamerge = require('app/server/util/datamerge.js');
const datatransform = require('app/server/util/datatransform.js');

const metaField = {
  START_DATE: 'start',
  END_DATE: 'end',
  DEVICE_ID: 'deviceid',
  SIM_SERIAL: 'simserial',
  PERSON: 'person',
  REGION: 'region',
  FACILITY: 'facility'
};

const formType = {
  SAMPLE_DEPARTURE: 'sdepart',
  SAMPLE_ARRIVAL: 'sarrive',
  RESULTS_DEPATURE: 'redepart',
  RESULTS_ARRIVAL: 'rarrive'
};

const REPEAT = 'srepeat';
const LAB_ID = 'labid';
const ST_ID = 'stid';
const ARTIFACT = 'stype';
const STATUS = 'condition';

const formElement = BPromise.method(parsed => {
  const form = _.values(formType).filter(type => !!parsed[type]);
  if (!(form || form[0])) {
    throw new Error(`Cannot identify form type among top elements:
                    ${Object.keys(parsed)}`);
  }
  return form[0];
});

const collectSubmission = xml => {
  log.debug('Transorming Lab Status XML', xml);
  const parse = xml2js.parseStringAsync(xml);
  const form = parse.then(formElement);
  return BPromise.join(parse, form, (parsed, formResult) => parsed[formResult]);
};

const repeats = form => BPromise.resolve(_.get(form, [REPEAT]));

const ST_ID_REPEAT_PATH = [ST_ID, 0];
const LAB_ID_REPEAT_PATH = [LAB_ID, 0];

const sampleIds = form => (
  repeats(form)
  .map(repeat => ({
    stId: _.get(repeat, ST_ID_REPEAT_PATH) || null,
    labId: _.get(repeat, LAB_ID_REPEAT_PATH) || null
  }))
  .then(results => _.uniqBy(results, ids => ids.stId))
);

const FACILITY_PATH = [metaField.FACILITY, '0'];
const PERSON_PATH = [metaField.PERSON, '0'];
const REGION_PATH = [metaField.REGION, '0'];
const STATUS_REPEAT_PATH = [STATUS, '0'];
const ARTIFACT_REPEAT_PATH = [ARTIFACT, '0'];

const metadata = form => {
  const repeatEl = repeats(form);

  const facilityMeta = datatransform.oneMeta(
    form, 'facility', FACILITY_PATH, null
  );
  const personMeta = datatransform.oneMeta(form, 'person', PERSON_PATH, null);
  const regionMeta = datatransform.oneMeta(form, 'region', REGION_PATH, null);
  const statusMeta = repeatEl.map(repeat =>
    datatransform.oneMeta(repeat, 'status', STATUS_REPEAT_PATH, null)
  );
  const artifactMeta = repeatEl.map(repeat =>
    datatransform.oneMeta(repeat, 'artifact', ARTIFACT_REPEAT_PATH, null)
  );

  return BPromise.join(
    facilityMeta, personMeta, regionMeta, statusMeta, artifactMeta
  )
  .then(_.flatten)
  .filter(item => item !== null)
  .then(results => _.uniqBy(results, meta => meta.key));
};

const upperCaseKey = key => key ? key.toUpperCase() : key;

const artifacts = form => (
  repeats(form)
  .map(repeat => ({
    stId: _.get(repeat, ST_ID_REPEAT_PATH) || null,
    labId: _.get(repeat, LAB_ID_REPEAT_PATH) || null,
    artifactType: upperCaseKey(_.get(repeat, ARTIFACT_REPEAT_PATH))
  }))
  .then(results => _.uniqBy(results, artifact => artifact.artifactType))
);

const FORM_TYPE_PATH = ['$', 'id'];
const END_DATE_PATH = ['end', 0];
const DEFAULT_STATUS = 'ok';

const changes = form => {
  const commonProps = BPromise.props({
    statusDate: dates.parseXMLDate(_.get(form, END_DATE_PATH)),
    stage: _.get(form, FORM_TYPE_PATH),
    person: upperCaseKey(_.get(form, PERSON_PATH)),
    region: upperCaseKey(_.get(form, REGION_PATH)),
    facility: upperCaseKey(_.get(form, FACILITY_PATH))
  });

  return BPromise.join(commonProps, repeats(form), (common, repeatEls) =>
    BPromise.map(repeatEls, repeat => ({
      stId: _.get(repeat, ST_ID_REPEAT_PATH),
      labId: _.get(repeat, LAB_ID_REPEAT_PATH) || null,
      statusDate: common.statusDate,
      stage: common.stage,
      artifactType: upperCaseKey(_.get(repeat, ARTIFACT_REPEAT_PATH)),
      region: common.region,
      facility: common.facility,
      person: common.person,
      status: upperCaseKey(_.get(repeat, STATUS_REPEAT_PATH, DEFAULT_STATUS))
    }))
  );
};

/**
 * Replaces the stId/labId value pair with the corresponding sampleId reference
 * (uuid).
 *
 * @method [fillSampleIdRefs]
 * @param {Array.<Object>} artifacts [description]
 * @param {Array.<Object>} sampleIds [description]
 * @return {Array.<Object>}          Array of artifacts with sampleId uuids
 */
const fillSampleIdRefs = BPromise.method((artifacts, sampleIds) => {
  if (!sampleIds) {
    throw new Error('Missing required parameter sampleIds');
  }
  if (!_.every(sampleIds, sampleId => !!sampleId.uuid)) {
    throw new Error('Missing required sampleIds uuid');
  }
  return datamerge.propKeyReduce(sampleIds, ['stId'])
  .then(idMap => {
    return BPromise.map(artifacts, artifact => {
      const sampleMatch = idMap[artifact.stId];
      return Object.assign({},
        _.omit(artifact, ['stId', 'labId']),
        {sampleId: sampleMatch.uuid}
      );
    });
  });
});

/**
 * Replaces the stId/labId value pair with the corresponding sampleId reference
 * (uuid). Using this sample reference, this function replaces the artifactType
 * value with the correct artifact reference (uuid).
 *
 * @param  {Array.<Object>} changes   [description]
 * @param  {Array.<Object>} sampleIds [description]
 * @param  {Array.<Object>} artifacts [description]
 * @return {Array.<Object>}           Array of changes with artifact uuids
 */
const fillArtifactRefs = (changes, sampleIds, artifacts) => {
  // Lookup samples by the STT IDs
  const mapSamples = datamerge.propKeyReduce(sampleIds, ['stId']);

  // Lookup artifacts by sampleId (uuid) and artifactType (metadata key)
  const mapArtifacts = datamerge.propKeyReduce(
    artifacts, ['sampleId', 'artifactType']
  );

  return BPromise.join(mapSamples, mapArtifacts)
  .spread((smapper, amapper) => {
    return BPromise.map(changes, change => {
      const sampleIdRef = smapper[change.stId];
      const artifactRef = amapper[sampleIdRef.uuid][change.artifactType];
      return Object.assign({},
        // Change objects do include stId, labId, and artifactType values
        // directly. Instead, it holds references artifacts (which themselves
        // reference a sample).
        _.omit(change, ['stId', 'labId', 'artifactType']),
        {artifact: artifactRef.uuid}
      );
    });
  });
};

module.exports = {
  collectSubmission,
  sampleIds,
  metadata,
  artifacts,
  changes,
  fillSampleIdRefs,
  fillArtifactRefs
};
