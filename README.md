# NutriScan_user_api

## Commands to Docker Compile and Run

To build and run the Docker container, use the following commands:

docker build -t nutriscanun-user-api .
docker run -d -p 3000:3000 --env-file .env --name nutriscanun-user-api-docker nutriscanun-user-api

Instructions to Deploy on Render
Follow these steps to deploy your service on Render:

Create a repository on GitHub and upload your code.
In Render, select "New Web Service" and connect your GitHub repository.
Configure the following parameters in Render:
Build Command:
bash
Copy code
docker build -t firestore-microservice .
Start Command:
bash
Copy code
docker run -p 3000:3000 firestore-microservice
Environment Variables: Add the necessary environment variables (e.g., PORT).
Deploy the service.
