import { describe, it, expect, vi } from "vitest"
import fs from "fs"
import { findWindowsAvastPath } from ".."
import dotenv from "dotenv"

dotenv.config()

vi.mock("fs")
vi.mock("child_process")

// Helper function to find Avast path
// function findWindowsAvastPath(): string | null {
//   const avastPath = "C:\\Program Files\\Avast Software\\Avast\\ashCmd.exe"
//   return fs.existsSync(avastPath) ? avastPath : null
// }

describe("avast", () => {
  it("should return the correct path if Avast is installed", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((path) =>
      (path as string).includes("Avast"),
    )

    const avastPath = findWindowsAvastPath()
    expect(avastPath).toBe(
      "C:\\Program Files\\Avast Software\\Avast\\ashCmd.exe",
    )
  })

  // it("should return null if Avast is not installed", () => {
  //   vi.spyOn(fs, "existsSync").mockReturnValue(false);

  //   const avastPath = findWindowsAvastPath();
  //   expect(avastPath).toBeNull();
  // });
})
