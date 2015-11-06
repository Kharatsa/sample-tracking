'use strict';

const express = require('express');
const router = express.Router();
const log = require('app/server/util/log.js');
const aggregate = require('app/server/odk/aggregateapi.js');

function sendXML(res, xml) {
  res.set({
      'Content-Type': 'text/xml',
      'Content-Length': xml.length
    });
  res.send(xml);
}

router.get('/formlist', function(req, res) {
  log.debug('ODK formList');
  aggregate.formList()
  .spread(function(listRes, listBody) {
    sendXML(res, listBody);
  });
});

router.get('/view/submissionList', function(req, res) {
  log.debug('ODK submissionList\n\tformId=%s\n\tnumEntries=%s',
    req.query.formId, req.query.numEntries);

  aggregate.submissionList(req.query.formId, req.query.numEntries)
  .spread(function(listRes, listBody) {
    sendXML(res, listBody);
  });
});

router.get('/view/downloadSubmission', function(req, res) {
  var formId = req.query.formId;
  var topElement = req.query.topElement || formId;
  var submissionId = req.query.submissionId;
  log.debug('ODK downloadSubmission\n\tformId=%s\n\ttopElement=%s' +
    '\n\tsubmissionId=%s', formId, topElement, submissionId);

  aggregate.downloadSubmission(formId, topElement, submissionId)
  .spread(function(subRes, subBody) {
    sendXML(res, subBody);
  });
});

module.exports = router;
