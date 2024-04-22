import {useEffect , useRef, useState} from 'react';
import {$generateHtmlFromNodes , $generateNodesFromDOM} from "@lexical/html"
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin"
import {AutoFocusPlugin} from "@lexical/react/LexicalAutoFocusPlugin"
import ToolbarPlugin from "./plugins/ToolbarPlugin" 
import "../styles/textEditor.css"
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import ImagesPlugin from './plugins/ImagesPlugin';
import YouTubePlugin from './plugins/YouTubePlugin';
import { LayoutPlugin } from './plugins/LayoutPlugin/LayoutPlugin';
import TableCellResizerPlugin from './plugins/TableCellResizer';
import { TablePlugin } from './plugins/TablePlugin';
import {CollaborationPlugin} from '@lexical/react/LexicalCollaborationPlugin';
import {useSharedHistoryContext} from './context/SharedHistoryContext';
import AutoEmbedPlugin from './plugins/AutoEmbedPlugin';
import CodeActionMenuPlugin from './plugins/CodeActionMenuPlugin';
import DragDropPaste from './plugins/DragDropPastePlugin';
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin';
import InlineImagePlugin from './plugins/InlineImagePlugin';
import KeywordsPlugin from './plugins/KeywordsPlugin';
import LinkPlugin from './plugins/LinkPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import MarkdownShortcutPlugin from './plugins/MarkdownShortcutPlugin';
import {MaxLengthPlugin} from './plugins/MaxLengthPlugin';
import PageBreakPlugin from './plugins/PageBreakPlugin';
import TabFocusPlugin from './plugins/TabFocusPlugin';
import TableCellActionMenuPlugin from './plugins/TableActionMenuPlugin';
import TableCellResizer from './plugins/TableCellResizer';
import TableOfContentsPlugin from './plugins/TableOfContentsPlugin';
import {CharacterLimitPlugin} from '@lexical/react/LexicalCharacterLimitPlugin';
import {CheckListPlugin} from '@lexical/react/LexicalCheckListPlugin';
import LexicalClickableLinkPlugin from '@lexical/react/LexicalClickableLinkPlugin';
import {useSettings} from './context/SettingsContext';
import {HashtagPlugin} from '@lexical/react/LexicalHashtagPlugin';
import {HorizontalRulePlugin} from '@lexical/react/LexicalHorizontalRulePlugin';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import {TabIndentationPlugin} from '@lexical/react/LexicalTabIndentationPlugin';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin';
import ContextMenuPlugin from './plugins/ContextMenuPlugin';
import AutocompletePlugin from './plugins/AutocompletePlugin';
import ComponentPickerMenuPlugin from './plugins/ComponentPickerPlugin';
import { $getRoot,  $insertNodes,  EditorState} from 'lexical';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';



const OnChangePlugin = (props: { onChange: (data: { content: string; editorState: any }) => void }) => {
const [editor] = useLexicalComposerContext();
useEffect(() => {
    const unsubscribe = editor.registerUpdateListener(({ editorState }) => {
        editorState.read(()=>{
            const htmlString = $generateHtmlFromNodes(editor, null);
            props.onChange({ content: htmlString, editorState });
        })
    });

    return unsubscribe;
}, [editor, props.onChange]);

return null;
};





export default function TextEditor(props: { editorContent: string; setEditorContent: (value: string) => void  ; editingMode:boolean ; setDescription:(value:string)=>void}): JSX.Element {
    const {historyState} = useSharedHistoryContext();
    
    const {
    settings: {
        isAutocomplete,
        isMaxLength,
        isCharLimit,
        isCharLimitUtf8,
        showTableOfContents,
        shouldUseLexicalContextMenu,
        tableCellMerge,
        tableCellBackgroundColor,

        },
    } = useSettings();
    
    const [editor] = useLexicalComposerContext();
    function LoadHtmlPlugin() {
        editor.update(() => {
            const parser = new DOMParser();
            const dom = parser.parseFromString(props.editorContent, 'text/html');
            const nodes = $generateNodesFromDOM(editor, dom);
            $getRoot().select();
            $getRoot().clear()
            $insertNodes(nodes)
            });
                return null;
        }
    const [isLinkEditMode , setIsLinkEditMode] =useState<boolean>(false)
    const {id} = useParams()
    const queryClient  =useQueryClient()
    const navigate = useNavigate()
    const mutation = useMutation({
        mutationFn:async(string:string)=>{
            const response = await axios.put(`http://localhost:3000/api/product/edit-product?productId=${id}` ,{description:string})
            return response
        },
        onSuccess:(data:any)=>{
            queryClient.refetchQueries({queryKey:['product' , id]})
            navigate(`/product/${id}`)
            console.log(data.data.message)
        }
    })
    const saveContent = ()=>{
        editor.update(() => {
            const htmlString = $generateHtmlFromNodes(editor, null);
            mutation.mutateAsync(htmlString)
        });
    }
return (
    <div className="editor-container" >
        {props.editingMode &&<div className="editor-header-container">
            <h1 className="new-product-heading" style={{marginLeft:0}}>Product's Description</h1>
                <button className='update-btn' onClick={saveContent}>
                    Update
                </button>
        </div>}
        <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode}/>
        <RichTextPlugin
        
        contentEditable={
                <ContentEditable  className="contentEditor" />
    }
        placeholder={<p className='placeholder'>Write product's description...</p>}
        ErrorBoundary={LexicalErrorBoundary}
        />
        {isMaxLength && <MaxLengthPlugin maxLength={30} />}
        <DragDropPaste />
        <CheckListPlugin />
        <KeywordsPlugin />
        <HistoryPlugin externalHistoryState={historyState} />
        <AutoEmbedPlugin />
        <MarkdownShortcutPlugin />
        <ClearEditorPlugin/>
        {props.editingMode &&<LoadHtmlPlugin/>}   
        <ListPlugin />
        <ComponentPickerMenuPlugin />
        <ImagesPlugin/>
        <AutoLinkPlugin/>
        <ListMaxIndentLevelPlugin maxDepth={7} />
        <HashtagPlugin/>
        <TabIndentationPlugin />
        <AutoFocusPlugin />
        {!props.editingMode && <OnChangePlugin onChange={(data: { content: string; editorState: EditorState }) => {
            props.setEditorContent(data.content)}} />}
        <YouTubePlugin/>
        <LayoutPlugin/>
        <TableCellResizerPlugin/>
        <InlineImagePlugin />
        <LinkPlugin />
        <PageBreakPlugin />
        <LayoutPlugin />
        <TabFocusPlugin />
        <LexicalClickableLinkPlugin />
        <DraggableBlockPlugin />
        <CodeActionMenuPlugin  />
        <FloatingLinkEditorPlugin
        isLinkEditMode={isLinkEditMode}
        setIsLinkEditMode={setIsLinkEditMode}
        />
        <TableCellActionMenuPlugin
        cellMerge={true}
        />
        <FloatingTextFormatToolbarPlugin
        />
        
        {(isCharLimit || isCharLimitUtf8) && (
        <CharacterLimitPlugin
            charset={isCharLimit ? 'UTF-16' : 'UTF-8'}
            maxLength={5}
        />
        )}
        {isAutocomplete && <AutocompletePlugin />}
        <div>{showTableOfContents && <TableOfContentsPlugin />}</div>
        {shouldUseLexicalContextMenu && <ContextMenuPlugin />}
        <HorizontalRulePlugin />
        <TableCellResizer />
    </div>
);
}
