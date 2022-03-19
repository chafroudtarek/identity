FROM node:14.18.0
MAINTAINER MOVE UP EDUCATION <tn.moveup@gmail.com>

# Installing bash.
# RUN apk add --no-cache bash bash-doc bash-completion

# Create a directory (to house our source files) and navigate to it.
WORKDIR /usr/src/app

# Copy over the bash script to test and wait on the availability of a TCP host and port.
COPY ./wait-for-it.sh /src/
RUN chmod +x /src/wait-for-it.sh
 
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./ 
  
# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

ENV PORT 3000
ENV HOST "localhost:3000"
ENV DB_URI "mongodb+srv://sifo:django123@learnmongo.ce0cz.mongodb.net/identity?retryWrites=true&w=majority"
ENV JWT_SECRET "09f26e402586e2faa8da4c98a35f1b20d6b033c60"
ENV SENDGRID_API_KEY "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"
ENV API_PREFIX "/api/v1"
ENV EMAIL "chafroudtarek9@gmail.com"
ENV AUTH_ROUTER_PREFIX "auth"
ENV expiresIn "180000s"

# Expose the specified port back to the host machine.
EXPOSE ${PORT}

# Starting Script
#CMD [ "npm", "run" ,"start" ]