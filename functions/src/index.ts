import * as functions from "firebase-functions";
import * as https from "https";
import * as cors from "cors";
import sizeOf from "image-size";
import {isValidHttpUrl} from "./utils/isValidHttpUrl";


export const imageSize = functions.https.onRequest((request, response) => {
  cors()(request, response, () => {
    const rawUrl = request.query.url as string;

    if (!isValidHttpUrl(rawUrl)) {
      response.send("Bad URL");
      return;
    }
    const {href: url} = new URL(rawUrl);
    functions.logger.info(`URL: ${url}`, {structuredData: true});

    https.get(url, function(r) {
      const chunks: Uint8Array[] = [];
      r
          .on("data", function(chunk) {
            chunks.push(chunk);
          })
          .on("end", function() {
            const buffer = Buffer.concat(chunks);
            response.send(sizeOf(buffer));
          });
    });
  });
});
