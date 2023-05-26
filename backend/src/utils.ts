import puppeteer from "puppeteer";

interface ABIOutput {
  internalType: string;
  type: string;
}

interface ABIObject {
  name: string;
  stateMutability: string;
  outputs: ABIOutput[];
  inputs: any[];
  type: string;
}

function removeComments(code: string | null): string {
  if (!code) return "";
  let result = code.replace(/\/\*[\s\S]*?\*\//g, "");
  result = result.replace(/\/\/.*/g, "");
  result = result.trim();

  return result;
}

function abridgeAddress(value: string) {
  return value.slice(0, 6) + "..." + value.slice(-4);
}

function formatObject(obj: any) {
  let newObj = { ...obj };

  const fieldsToAbridge = ["Contract Address", "Tx Hash", "Creator"];
  for (let field of fieldsToAbridge) {
    if (newObj[field]) newObj[field] = abridgeAddress(newObj[field]);
  }
  if (newObj["Total Supply"])
    newObj["Total Supply"] = parseFloat(newObj["Total Supply"]).toFixed(2); // round token supply
  if (newObj["Compiler Version"])
    newObj["Compiler Version"] = newObj["Compiler Version"].split("+")[0]; // abridge compiler version

  delete newObj["Contract Arguments"];
  delete newObj["Evm Version"];
  delete newObj["Optimization"];
  delete newObj["Optimization Runs"];

  return newObj;
}

export async function fetchContract(contractAddress: string) {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROMIUM_PATH,
    args: ["--no-sandbox"], // This was important. Can't remember why
  });
  const page = await browser.newPage();
  await page.goto(
    `https://www.mintscan.io/evmos/evm/contract/${contractAddress}`,
    { waitUntil: "networkidle2" }
  );

  await page.waitForSelector(".InfoRow_container__2xTzg", {
    timeout: parseInt(process.env.TIMEOUT ?? "10000"),
  });

  const metadata = await page.evaluate(() => {
    const containers = Array.from(
      document.querySelectorAll(".InfoRow_container__2xTzg")
    );
    let result: { [key: string]: string } = {};
    containers.forEach((container) => {
      let labelElement = container.querySelector(
        ".InfoRow_label__3ZFgC"
      ) as HTMLElement;
      let valueElement = container.querySelector(
        ".InfoRow_value__1CHna"
      ) as HTMLElement;
      if (labelElement && valueElement) {
        let label = labelElement.innerText.trim();
        let value = valueElement.innerText.trim();
        result[label] = value;
      }
    });
    return result;
  });

  const formattedMetadata = formatObject(metadata);
  // console.log(metadata);

  const code = await page.evaluate(() => {
    let codeElement = document.querySelector("code.hljs.php") as HTMLElement;
    if (!codeElement) {
      codeElement = document.querySelector("code.hljs.zephir") as HTMLElement;
    }
    return codeElement ? codeElement.innerText : null;
  });

  const codeMinified = removeComments(code).replace(/\s+/g, " ").trim();

  // console.log(codeMinified);

  await page.$$eval("button", (buttons) => {
    for (let button of buttons) {
      let p = button.querySelector("p");
      if (p && p.textContent === "ABI") {
        (button as HTMLButtonElement).click();
      }
    }
  });

  await page.waitForSelector(".ABIContent_abiContent__6HWYR", {
    timeout: parseInt(process.env.TIMEOUT ?? "10000"),
  });

  const abi = await page.evaluate(() => {
    const tooltips = Array.from(
      document.querySelectorAll(".__react_component_tooltip")
    );
    for (const tooltip of tooltips) {
      tooltip.remove();
    }

    const abis = Array.from(
      document.querySelectorAll(".ABIContent_abiContent__6HWYR")
    );
    const result: ABIObject[] = [];

    for (const abi of abis) {
      const name =
        abi.querySelector(".InfoRow_value__1CHna")?.textContent || "";

      const stateMutability =
        abi.querySelector(".InfoRow_value__1CHna")?.nextElementSibling
          ?.textContent || "";

      const outputs = Array.from(
        abi.querySelectorAll(".ABIContent_arrayRow__3W7R6")
      );
      const outputsArray: ABIOutput[] = [];

      for (const output of outputs) {
        if (output.lastChild) {
          const internalType = output.lastChild.textContent || "";
          const type = output.lastChild.textContent || "";
          outputsArray.push({ internalType, type });
        }
      }

      const functionObject: ABIObject = {
        name,
        stateMutability,
        outputs: outputsArray,
        inputs: [],
        type: "function",
      };

      result.push(functionObject);
    }

    return result;
  });

  const functionNames = abi
    .filter((item) => item.type === "function")
    .map((item) => item.name);

  const abiMinified = JSON.stringify(abi);

  await browser.close();

  return {
    metadata: formattedMetadata,
    code: codeMinified,
    abi: abiMinified,
    functionNames,
  };
}

// fetchContract("0x88361F09F8c93283e76b8efE2A0d5FC4cBEb97a9").catch(
//   console.error
// );
