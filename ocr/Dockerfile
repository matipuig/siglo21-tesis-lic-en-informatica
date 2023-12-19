# NOTE: You might change the node version.

# NOT USING ALPINE BECAUSE OF PROBLEMS INSTALLING PDFTK.
FROM node:16.12  

# Install OCR packages.
RUN apt-get update \ 
    && apt-get install -y pdftk poppler-utils ghostscript libleptonica-dev automake pkg-config libsdl-pango-dev libcairo2-dev libicu-dev bc \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Tesseract 4.1.1.
RUN wget https://github.com/tesseract-ocr/tesseract/archive/4.1.1.zip \
    && unzip 4.1.1.zip \
    && cd tesseract-4.1.1 \
    && ./autogen.sh \
    && ./configure \
    && make install \
    && ldconfig \
    && make training \
    && make training-install 

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

# Depending in the case you might want compile or building.
RUN npm run compile

# Add tesseract files.
USER root
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/tessdata
COPY ./tesseract /usr/share/tesseract-ocr/

# It's very important to run it with node and not pm2 or another process manager.
# This way, you give the restart decision to docker-compose.
USER node
CMD ["npm", "run", "start-from-docker", "--silent"]