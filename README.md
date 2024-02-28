# Simple E-Commerce-API

This API is created with NodeJS that mainly uses express, jsonwebtoken, sequalize and other useful libraries. The API uses Postgre DB and uses sequalize to create Model as well as to execute queries on the DB side. Note that, this API is not a production ready API and it needs more polish and adjustments to be used. I kept some stuff more simple for sake of brevity but customization is really simple as folder structure is kept simple as well. You will see a few utils and middleware which are really simple authorization codes for private routes. In controllers and Routes I left some useful comments for further customization.

# Requirements
- NodeJS preferably LTS version
- PostgreSQL
- PgAdmin (This is probably installed with PostgreSQL if you prefer other software to view your DB it would probably work too)
- Postman (To Test the API Routes and the collection of readly set routes are included in the Repository.) 

# Installation
- Clone the repository to your local.

		git clone https://github.com/pnzrkmpfwgn/ecommerceApi.git {directory name}
- Open the project directory in terminal and type.
	
		npm install

- in the .env.example file fill in the required information and rename the file as .env
- You need open your postgre server to use the API routes make sure you entered correct postgre credentials.
- To start the server type

		npm start
- Nodemon will log if the server started correctly if you see that Models are synced with your DB that means the API is ready to go.
- To see if the columns at your DB side synced with the backend you can refresh the columns in pgAdmin. If you see the model table names under the Tables then that means the DB is set up correctly as well.

