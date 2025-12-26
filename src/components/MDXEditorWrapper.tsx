'use client';

import {
    MDXEditor,
    MDXEditorMethods,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    toolbarPlugin,
    BlockTypeSelect,
    CodeToggle,
    ListsToggle,
    InsertTable,
    tablePlugin,
    codeBlockPlugin,
    codeMirrorPlugin,
    linkPlugin,
    CreateLink,
    InsertImage,
    imagePlugin
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { useRef } from 'react';

interface MDXEditorWrapperProps {
    markdown: string;
    onChange: (value: string) => void;
    selectedFont?: string;
}

export default function MDXEditorWrapper({ markdown, onChange, selectedFont }: MDXEditorWrapperProps) {
    const editorRef = useRef<MDXEditorMethods>(null);

    return (
        <div
            className="h-full overflow-auto bg-white dark:bg-slate-900"
            style={{ fontFamily: selectedFont || 'inherit' }}
        >
            <MDXEditor
                ref={editorRef}
                markdown={markdown}
                contentEditableClassName="prose dark:prose-invert max-w-none px-8 py-6 outline-none min-h-[400px] text-slate-900 dark:text-white"
                className="mdxeditor h-full"
                onChange={onChange}
                plugins={[
                    headingsPlugin(),
                    listsPlugin(),
                    quotePlugin(),
                    thematicBreakPlugin(),
                    markdownShortcutPlugin(),
                    tablePlugin(),
                    linkPlugin(),
                    imagePlugin(),
                    codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
                    codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', html: 'HTML' } }),
                    toolbarPlugin({
                        toolbarContents: () => (
                            <div className="flex flex-wrap gap-1">
                                <UndoRedo />
                                <BoldItalicUnderlineToggles />
                                <BlockTypeSelect />
                                <CodeToggle />
                                <ListsToggle />
                                <InsertTable />
                                <CreateLink />
                                <InsertImage />
                            </div>
                        )
                    })
                ]}
            />
        </div>
    );
}
