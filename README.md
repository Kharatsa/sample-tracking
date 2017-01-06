# Sample Transport Tracking (STT)

## Production Deploy

### CloudFormation stack deployment
This repo provides an [AWS CloudFormation](https://aws.amazon.com/cloudformation/) 
template in the `deploy/` directory. The template defines the resources
necessary for the full STT application stack. Once the stack resources are
deployed, some additional setup scripts are required to complete the
bootstrap process.

The resources covered by the stack template are:
* EC2 instance, *Ubuntu 16.04.1 LTS (Xenial Xerus)*
* RDS instance, *MySQL 5.7*
* Elastic IP address

#### Setup parameters

* Database
    * **DBUser**: The MySQL username the STT application and ODK should use
      when connecting to the database server. This user will be granted all
      access on the `stt` and `odk_stt` databases.
    * **DBPassword**: The password for the **DBUser**.
* Application
    * **STTUser**: The initial account username to create when deploying the
      STT application. This user will be flagged as an administrator.
    * **STTPassword**: The password for the **STTUser**.
* ODK
    * **ODKUser**: The username in ODK Aggregate the STT application should use
      for all submissions. This ODK Aggregate user will need at least *Data
        Collector* permissions.
    * **ODKPassword**: The password for the **ODKUser**.
* **TLDomain**: The top-level hostname shared between the STT application and
  ODK components. The application will be accessible at either `TLDomain` or
  `www.TLDomain`, while ODK will be accessible at `odk.TLDomain`.

### DNS Configuration

While the CloudFormation stack does include a static Elastic IP address, but 
does not automatically manage DNS configuration. Separately configure your
domain name to point at the EC2 server's IP address.

| Record Type | Name          | Value         | 
| ----------- | ------------- | ------------- |
| A           |               | *Elastic IP*  |
| CNAME       | www           | *TL_HOSTNAME* |
| CNAME       | odk           | *TL_HOSTNAME* |


### Complete server setup
#### Application

SSH into the new stack's EC2 instance (look for the name "STT Server"). Execute
the `setup.sh` shell script to complete the NGINX and LetsEncrypt
configuration, and to retrieve, deploy, and launch the STT application
database, server, and ODK Aggregate service.

    git clone https://github.com/Kharatsa/SampleTransportTracking.git ~/stt
    cd ~/stt
    sudo ./setup.sh

To ensure consistent availability over HTTPS, you must schedule a cron job to
periodically renew the LetsEncrypt certificates. To add a new cron job, run
`crontab -e` to launch the crontab editor (choose whichever editor is most
convenient), and add the following line. Make certain the crontab file ends in
a newline, or a comment line before saving.

    0 0 1 * * /home/ubuntu/stt/renew_certs.sh >> /var/log/letsencrypt/renew.log 2>&1
    #

When this setup is complete, the STT dashboard application should be
accessible at *https://TL_HOSTNAME*. The ODK Aggregate server should
be accessible at *http://odk.TL_HOSTNAME*.

#### ODK Aggregate
Once ODK Aggregate is accessible, you will to manually log in and create
*ODKUser* specified during the stack deployment.

From the ODK Aggregate dashboard page, find the *Log In* link in the upper
right. Login with the default administrator credentials through the *Sign in
with Aggregate Password* option.

| Username  | Password  |
| --------- | --------- |
| admin     | aggregate |

At the top of the page, you should see a message in red text indicating that
the "server and its data are not secure." 

```
This server and its data are not secure! Please change the super-user's password!
```

This is becaues your ODK Aggregate server is still using its default admin
credentials. Once logged in, you should change these defaults. To do so,
select the *Site Admin* tab. Find the *Username* **admin**, and click
*Change Password*. Click *Save*.

Once you've changed the default admin password, you should create the
*ODKUser*. Enter the *ODKUser* specified during setup in the *Add Users* text
area input and click *Add*. The *ODKUser* should now appear listed as a new
row with the other default ODK Aggregate users.

Check the *Data Collector*, *Data Viewer*, and *Form Manager* checkboxes
on/checked for the *ODKUser* row. Finally, click *Change Password* on your new
users's row, and input the *ODKPassword* provided during setup, and click *Save
Changes*

The warning banner should now be absent from the top of the ODK Aggregate page.

## DB
We are using RDS for our db, so they manage backups.  Currently we just have automated backups which will back up the db everyday and keep the last 7 days.  So if there is ever an issue you can always restore to a point in time.  If you would ever like to move the db to another region or for any other reason you'll need to create a snapshot and restore from that snap shot.  You can find out how to do that here.[http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_CreateSnapshot.html]

### Backups
Here is some documentation.  [http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html]

### Restore
Here is how to restore to a point in time.
[http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html]
