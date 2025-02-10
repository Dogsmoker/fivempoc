import { promises as fs } from "fs";
import path from "path";


// Since the cef debugging endpoint requires canary, this is to automate that.
// Example:

/*
async((
    const fivemPath = await getFiveMPath();
    if (fivemPath) {
        if (!await checkUpdateChannel(fivemPath)) {
            await setUpdateChannel(fivemPath);
        }
    }
))();
*/

export async function getFiveMPath(): Promise<string | null> {
    const process = Bun.spawn([
        "powershell",
        "-Command",
        "Get-ItemPropertyValue -Path 'HKCU:\\Software\\CitizenFX\\FiveM' -Name 'Last Run Location'"
    ]);

    const output = await new Response(process.stdout).text();
    
    return output.trim() || null;
}

export async function setUpdateChannel(fivemPath: string): Promise<void> {
    const iniPath = path.join(fivemPath, "CitizenFX.ini");

    try {
        const iniContent = await fs.readFile(iniPath, "utf-8");

        const newIniContent = iniContent.replace(/^UpdateChannel=.*$/m, "UpdateChannel=canary");

        await fs.writeFile(iniPath, newIniContent, "utf-8");
    } catch (error) {
        console.error("setUpdateChannel err:", error);
    }
}

export async function checkUpdateChannel(fivemPath: string): Promise<boolean> {
    const iniPath = path.join(fivemPath, "CitizenFX.ini");

    try {
        const iniContent = await fs.readFile(iniPath, "utf-8");

        const match = iniContent.match(/^UpdateChannel=(.*)$/m);

        if (match && match[1] === "canary") {
            return true;
        }
        return false;

    } catch (error) {
        return false; 
    }
}
