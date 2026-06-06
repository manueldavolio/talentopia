import { NextResponse } from "next/server";
import { isFilesystemWritable } from "@/lib/questions/store";

export const ADMIN_FILE_EDITING_LOCAL_ONLY =
  "Admin file editing is local-only";

export function adminWriteBlockedResponse() {
  return NextResponse.json(
    { error: ADMIN_FILE_EDITING_LOCAL_ONLY },
    { status: 501 }
  );
}

export function requireFilesystemWritable() {
  if (isFilesystemWritable()) return null;
  return adminWriteBlockedResponse();
}
