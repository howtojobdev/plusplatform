import React from "react";
import type { ContentBlockType } from "../../domain/contentBlockType";
import { CONTENT_BLOCK_MAP } from "./config";

type Props = { blocks: ContentBlockType[] };

export const ContentBlockRenderer = ({ blocks }: Props) => {
    
    return (
        <div className="flex flex-col gap-8 md:gap-18">
            {blocks.map((block, idx) => {
                const Component =
                    CONTENT_BLOCK_MAP[block.type] as React.ComponentType<any>

                return (
                    <Component
                        key={`${block.type}-${idx}`}
                        block={block}
                        index={idx}
                    />
                )
            })}
        </div>
    )
};