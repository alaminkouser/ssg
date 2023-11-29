const SOURCE = "./source/";
const DOCUMENTS = "./documents/";

function getFileList(source: string): Promise<Array<string>> {
  const FILE_LIST: Array<string> = [];
  async function getFilesRecursively(source: string): Promise<Array<string>> {
    for await (const entry of Deno.readDir(source)) {
      if (entry.isFile) FILE_LIST.push(source + entry.name);
      if (entry.isDirectory) {
        await getFilesRecursively(source + entry.name + "/")
          .catch((error) => {
            return error;
          });
      }
    }
    return FILE_LIST;
  }
  return new Promise((resolve, reject) => {
    if (!source.endsWith("/")) {
      reject(
        "SOURCE IS NOT A DIRECTORY.",
      );
    }
    Deno.stat(source)
      .then((value) => {
        if (value.isDirectory) {
          getFilesRecursively(source)
            .then((v) => {
              resolve(v);
            });
        } else {
          reject(
            "SOURCE IS NOT A DIRECTORY.",
          );
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

if (DOCUMENTS.endsWith("/")) {
  Deno.stat(DOCUMENTS).then(async (value) => {
    console.log("Y");
    if (value.isDirectory === true) {
      await Deno.remove(DOCUMENTS, { recursive: true });
      await Deno.mkdir(DOCUMENTS);
    }
    console.log("Y-O");
  }).catch(async (_) => {
    console.log("N");
    await Deno.mkdir(DOCUMENTS);
    console.log("N-O");
  }).finally(() => {
    console.log("finally");
    getFileList(SOURCE).then((fileList) => {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i].replace(SOURCE, "");
        if (file.startsWith("_/") && file !== "_/404/index.md") {
          console.log(file);
        }
      }
    }).catch((error) => {
      console.error(error);
    });
  });
} else {
  console.error("DOCUMENTS IS NOT A DIRECTORY.");
}
