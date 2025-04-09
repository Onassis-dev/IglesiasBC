import { api, tsr } from '@/lib/boilerplate';
import { Sheet, SheetBody, SheetContent, SheetTitle, SheetTrigger, SheetHeader } from '@/components/ui/sheet';
import type { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import { Button, RegisterButton } from '@/components/ui/button';
import { Bold, Check, HeadingIcon, Image, Italic, LoaderIcon, Strikethrough } from 'lucide-react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Toggle } from '@/components/ui/toggle';
import './tiptap.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { PostPostSchema } from '@iglesiasbc/schemas';
import { useFormQuery } from '@/lib/hooks/useFormQuery';

interface props {
    id: string | number;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const BlogForm = ({ id, open, setOpen }: props) => {
    const defaultValues: z.infer<typeof PostPostSchema> = {
        title: '',
        description: '',
        body: '',
    };

    const blogForm = useForm<z.infer<typeof PostPostSchema>>({
        resolver: zodResolver(PostPostSchema),
        defaultValues: defaultValues,
    });
    const [showEditor, setShowEditor] = useState(false);
    const [selectedFile, setSelectedFile]: any = useState(null);
    const client = tsr.useQueryClient();

    const editor = useEditor({
        extensions: [
            StarterKit.configure(),
            Placeholder.configure({
                placeholder: 'Empieza a escribir aquí...',
            }),
        ],
        content: blogForm.getValues('body'),
        editorProps: {
            attributes: {
                class: 'max-h-full h-full overflow-y-auto p-0 mb-0 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-ring  ',
            },
        },
        onUpdate({ editor }) {
            blogForm.setValue('body', editor.getHTML(), { shouldValidate: true });
        },
    });

    const post = useFormQuery(tsr.posts.getOne.useQuery, {
        queryKey: ['posts', id],
        enabled: !!id && open,
        queryData: {
            params: { id: String(id) },
        },
    });

    const handleSubmit = async (values: z.infer<typeof PostPostSchema>) => {
        const formdata = new FormData();
        formdata.append('title', values.title);
        if (id) {
            await api(tsr.posts.put, { ...values, id: Number(id) });
        } else {
            if (!selectedFile) throw new Error('No se seleccionó ninguna imagen');
            await api(tsr.posts.post, { ...values, file: selectedFile });
        }

        client.refetchQueries({ queryKey: ['posts'] });
        setOpen(false);
    };

    const handleFile = (e: any) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    };

    useEffect(() => {
        if (!open) {
            blogForm.reset(defaultValues);
            setSelectedFile(null);
            editor?.commands.setContent('');
            setShowEditor(false);
            return;
        }

        if (!post) {
            setShowEditor(true);
            return;
        }

        blogForm.reset({
            ...post,
        });
        setSelectedFile(null);
        editor?.commands.setContent(post?.body || '');
        setShowEditor(true);
    }, [post, open]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <RegisterButton>Publicar post</RegisterButton>
            </SheetTrigger>
            <SheetContent
                submit={blogForm.handleSubmit((values: z.infer<typeof PostPostSchema>) =>
                    showPromise(handleSubmit(values), id ? 'Post actualizado' : 'Post publicado')
                )}
            >
                <SheetHeader>
                    <SheetTitle>{id ? 'Editar post' : 'Publicar post'}</SheetTitle>
                </SheetHeader>
                <div className="flex flex-row items-center border-b border-input min-h-9 px-4 sm:px-6 gap-2">
                    <Toggle
                        pressed={editor?.isActive('heading')}
                        onPressedChange={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                        className="size-6 p-0"
                    >
                        <HeadingIcon className="size-4" />
                    </Toggle>
                    <Toggle
                        pressed={editor?.isActive('bold')}
                        onPressedChange={() => editor?.chain().focus().toggleBold().run()}
                        className="size-6 p-0"
                    >
                        <Bold className="size-4" />
                    </Toggle>
                    <Toggle
                        pressed={editor?.isActive('italic')}
                        onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
                        className="size-6 p-0"
                    >
                        <Italic className="size-4" />
                    </Toggle>
                    <Toggle
                        pressed={editor?.isActive('strike')}
                        onPressedChange={() => editor?.chain().focus().toggleStrike().run()}
                        className="size-6 p-0"
                    >
                        <Strikethrough className="size-4" />
                    </Toggle>
                    <Button asChild className="ml-auto h-7 px-2 cursor-pointer relative" variant="ghost">
                        <label>
                            <Image className="size-4 mr-1" />
                            Portada
                            {selectedFile && <Check className="size-3.5 -bottom-0 right-0.5 absolute text-green" />}
                            {!selectedFile && !id && <span className="size-3.5 bottom-2.5 -right-2 absolute text-destructive">!</span>}
                            <Input type="file" accept="image/*" id="username" onChange={(e) => handleFile(e)} className="hidden" />
                        </label>
                    </Button>
                </div>

                <SheetBody className="p-0">
                    <Form {...blogForm}>
                        <form
                            onSubmit={blogForm.handleSubmit((values: z.infer<typeof PostPostSchema>) =>
                                showPromise(handleSubmit(values), id ? 'Post actualizado' : 'Post publicado')
                            )}
                            className="grid h-full overflow-y-auto "
                            style={{ gridTemplateRows: 'auto auto 1fr' }}
                        >
                            <FormField
                                control={blogForm.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="px-4 sm:px-6 pt-6">
                                        <FormControl>
                                            <Input placeholder="Titulo" {...field} className="border-none font-semibold text-2xl !ring-0 p-0" />
                                        </FormControl>
                                        <FormMessage className="h-5" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={blogForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="px-4 sm:px-6">
                                        <FormControl>
                                            <Input
                                                placeholder="Descripción"
                                                {...field}
                                                className="border-none h-8 text-muted-foreground !ring-0 p-0"
                                            />
                                        </FormControl>
                                        <FormMessage className="h-5" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={blogForm.control}
                                name="body"
                                render={() => (
                                    <FormItem className="px-4 sm:px-6">
                                        <FormControl>
                                            {showEditor ? (
                                                <EditorContent editor={editor}></EditorContent>
                                            ) : (
                                                <div className="w-full h-full flex justify-center items-center">
                                                    <LoaderIcon className="animate-spin size-8" />
                                                </div>
                                            )}
                                        </FormControl>
                                        <FormMessage className="h-5" />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </SheetBody>
            </SheetContent>
        </Sheet>
    );
};

export default BlogForm;
