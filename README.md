# StreamerEventViewer

StreamerEventViewer helps its audience see their favorite streamer's Twitch events in real-time.

Demo Video : [https://www.youtube.com/watch?v=fh46idVufgI&feature=youtu.be]

Live Demo : [http://34.230.90.77:3000/](http://34.230.90.77:3000/)

## Description

The authentication is performed using the Twitch OAuth2 API and the user information received on successful authentication is stored in MongoDB. The homepage lets the user set his favorite streamer by entering in the username. This information is also updated on the database to be preserved for future logins. The user is also provided with the ability to update his favorite streamer anytime.

Once a favorite streamer is set, the backend sends a POST request to initiate a webhook that listens to all the activities of the streamer. The events received via webhooks are logged on to the database in the format *id, streamer_name, event_type, viewer_name, created_at.*

The watch stream button takes the user to the latest live stream of the streamer along with the user chat. The right side panel displays the most recent 10 events of the streamer listed in the reverse chronological order and is updated in realtime.

## Tech Stack

**MeteorJS** : An open-source platform for web, mobile, and desktop which makes shipping javascript applications simple, efficient, and scalable.

**ReactJS** : Frontend Framework

**MongoDB** : Highly-scalable NoSQL database

**Twitch Developer Tools** : APIs, Webhooks, and WebSockets

**nginx** : Web Server

**AWS EC2** : Deployment

## Running the app locally

To run this app locally:

- clone this repo
- cd into the app's directory
- run meteor npm install then meteor
- open http://localhost:3000 in your browser

## AWS Architecture

![AWS (2019) horizontal framework](https://user-images.githubusercontent.com/7234185/100400389-5fd9d780-3024-11eb-9300-4aca7bd62542.png)
The above architecture looks to be ideal for this use case and the architecture is designed with a large provision for future scaling

Some of the major components used in the architecture are :

**Amazon Route 53** : Amazon Route 53 is a scalable and highly available Domain Name System service.

**Amazon CloudFront** : A Content delivery network (CDN) that provides a globally-distributed network of proxy servers that cache content more locally to consumers, thus improving access speed for downloading the content.

**AWS S3** : S3 is an object storage service that we use to store static content such as images and fonts and also EBS & Database snapshots.

**AWS EC2** : EC2 provides secure, resizable compute capacity in the cloud. The Nginx webserver and the Meteor web-app runs inside EC2 instances and the autoscaling ability of EC2 enables faster scaling of the instances as per the requirement.

**Elastic Load Balancer**: Elastic Load Balancing automatically distributes incoming application traffic across multiple targets, such as Amazon EC2 instances, containers, IP addresses.

**MongoDB Instance:** This is an EC2 server running MongoDB. Since it runs on an EC2 server, the DB is highly scalable. A standby instance of the DB is also kept running. Hourly/Daily snapshots are stored in AWS S3.

This can be also replaced with third-party services such as MongoAtlas which also can be configured to run on the same AWS region.

### Scaling

For about 100 req/day, a simple architecture that includes Route53 and EC2 instances which runs the database locally is only required. As the number of requests increases, we will need to choose an instance with high I/O, high storage, and high CPU. This is called vertical scaling. As we scale further the first thing that we need to do is set up the instances replicas in different geographical regions to serve the user base and also move the static resources to a CDN like Amazon CloudFront.

Initially one can start with relational DBs but as the number of requests increases, it is ideal to move to NoSQL DBs such as MongoDB which provides super low latency ideal for handling requests.

As we move to an even larger number of requests (around 100K/day) we should start scaling horizontally by increasing the number of EC2 instances per region and separating the workload between them.

We should also consider setting up an auto-scaling group at this point as our traffic might not be uniform throughout the day. auto-scaling keeps us ready for the sudden surges in traffic. We can also use services such as Amazon CloudWatch to improve collect usage metrics and set up alarms.

As we scale closer to 900M req/day we need to migrate to service-oriented architecture which separates the layers (mainly presentation, logic, and data layers) of the application so that we can manage them independently and scale accordingly. We can also move to a microservices architecture in which each type of request is handled by a specific instance which helps us increase or decrease the instance specification based on the request that we get.

### Questions

1 :

```sql
SELECT streamer_name, COUNT(streamer_name) FROM events GROUP BY streamer_name;
```

2 :

 

```sql
SELECT streamer_name,event_type,COUNT(event_type) FROM events GROUP BY event_type,streamer_name;
```
