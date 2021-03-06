#### Setup

```bash
npm install && npm start
```

#### Database Connection

1. Import connect.js
2. Invoke in start()
3. Setup .env in the root
4. Add MONGO_URI with correct value

#### Routers

- auth.js
- jobs.js

#### User Model

Email Validation Regex

```regex
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```

### Everything is done using mongoose validators, mongoose middlewares, mongoose instance methods bec its so powerful

#### Register User (Hash the password)
<!-- Everything with the help of mongoose -->
- Validate - name, email, password - with Mongoose
- Hash Password (with bcryptjs)
- Save User 
- Generate Token
- Send Response with Token

#### Login User

- Validate - email, password - in controller
- If email or password is missing, throw BadRequestError
- Find User
- Compare Passwords
- If no user or password does not match, throw UnauthenticatedError
- If correct, generate Token
- Send Response with Token

#### Mongoose Errors

- Validation Errors
- Duplicate (Email)
- Cast Error

#### Security

- helmet (most popular for setting various http headers to prevent numerous possible attacks)
- cors (by installing & implementing the cors package essentially we make our api accessible to the public)
- xss-clean (sanitizes the user input in req.body,req.query & req.params & as a result protects us from cross-site scripting attacks where the attacker tries to inject some milicious code)
- express-rate-limit (to limit the amount of requests the user can make)

Swagger UI

```yaml
/jobs/{id}:
  parameters:
    - in: path
      name: id
      schema:
        type: string
      required: true
      description: the job id
```