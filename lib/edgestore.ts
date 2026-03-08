"use client";
import { type EdgeStoreRouter } from "../app/api/edgestore/[...edgestore]/route";
import { createEdgeStoreProvider } from "@edgestore/react";

const { EdgeStoreProvider, useEdgeStore } =
  createEdgeStoreProvider<EdgeStoreRouter>();
export { EdgeStoreProvider, useEdgeStore };

const MEDIA_BLOCK_TYPES = new Set(["image", "video", "audio", "file", "pdf"]);

export const getDocumentUrls = (document: any): string[] => {
  const urls: string[] = [];

  if (document.coverImage) {
    urls.push(document.coverImage);
  }

  if (document.content) {
    try {
      const blocks = JSON.parse(document.content);
      const traverse = (blocks: any[]) => {
        for (const block of blocks) {
          if (MEDIA_BLOCK_TYPES.has(block.type) && block.props?.url) {
            urls.push(block.props.url);
          }
          if (block.children?.length) traverse(block.children);
        }
      };
      traverse(blocks);
    } catch {}
  }

  return urls;
};
