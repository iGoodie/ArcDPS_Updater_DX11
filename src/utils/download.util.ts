import axios from "axios";
// import * as chalk from "chalk";
// import * as ProgressBar from "progress";

export function downloadFile(
  url: string,
  writeStream: NodeJS.WritableStream
  // printProgress: boolean
) {
  return new Promise(async function (resolve, reject) {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    // if (printProgress) {
    //   const total = response.headers["content-length"];
    //   if (total !== undefined) {
    //     const progressBar = new ProgressBar("", {
    //       width: 40,
    //       complete: "=",
    //       incomplete: " ",
    //       renderThrottle: 1,
    //       total,
    //     });
    //     response.data.on("data", (chunk: any) =>
    //       progressBar.tick(chunk.length)
    //     );
    //   } else {
    //     console.log(chalk.blueBright("[i] Downloading..."));
    //   }
    // }

    response.data.on("end", resolve);
    response.data.on("error", reject);
    response.data.pipe(writeStream);
  });
}
