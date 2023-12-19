# DOCKERFILE
FROM node:16.12-alpine


# Install node packages.
# Apply the permissions on the begining.
RUN mkdir -p /home/node/app/node_modules \
    && chown -R node:node /home/node/app \
    && chmod -R +x /home/node/app

WORKDIR /home/node/app
COPY --chown=node:node package*.json ./

# Do NOT run as root user!
USER node
RUN npm install
COPY --chown=node:node . .

# Copy the env file.
#ARG ENV_FILE_PATH
#ENV ENV_FILE_PATH=${ENV_FILE_PATH}
#RUN test -n "${ENV_FILE_PATH}"
#ADD "${ENV_FILE_PATH}" ./.env
# COPY --chown=node:node "${ENV_FILE_PATH}" .

# Start the app.
RUN npm run build
EXPOSE 3000
CMD npm run start
