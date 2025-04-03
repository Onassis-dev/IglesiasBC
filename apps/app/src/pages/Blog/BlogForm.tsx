import { api, tsr } from '@/lib/boilerplate';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import type { z } from 'zod';
import { DialogHeader } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import { Button, RegisterButton } from '@/components/ui/button';
import { Bold, Check, HeadingIcon, Image, Italic, LoaderIcon, Strikethrough, Upload, X } from 'lucide-react';
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
                class: 'max-h-full h-full overflow-y-auto p-3 mb-0 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-ring  ',
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
        if (!selectedFile) throw new Error('No se seleccionó ninguna imagen');
        formdata.append('title', values.title);
        if (id) await api(tsr.posts.put, { ...values, id: Number(id) });
        else await api(tsr.posts.post, { ...values, file: selectedFile });

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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <RegisterButton>Publicar post</RegisterButton>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] h-full max-w-2xl flex flex-col p-0" closeButton={false}>
                <DialogHeader className="flex flex-row items-center border-b border-input min-h-10 p-2 space-y-0 gap-0.5">
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive('heading')}
                        onPressedChange={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                        className="aspect-square"
                    >
                        <HeadingIcon className="size-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive('bold')}
                        onPressedChange={() => editor?.chain().focus().toggleBold().run()}
                        className="aspect-square"
                    >
                        <Bold className="size-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive('italic')}
                        onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
                        className="aspect-square"
                    >
                        <Italic className="size-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive('strike')}
                        onPressedChange={() => editor?.chain().focus().toggleStrike().run()}
                        className="aspect-square"
                    >
                        <Strikethrough className="size-4" />
                    </Toggle>
                    <label className="h-9 px-2.5 flex items-center justify-center gap-2 rounded-md hover:bg-muted cursor-pointer ml-auto relative">
                        <Image className="size-4 " />
                        {selectedFile && <Check className="size-3.5 bottom-0.5 right-1 absolute text-green" />}
                        {!selectedFile && !id && <span className="size-3.5 bottom-3 -right-1 absolute text-destructive">!</span>}
                        <Input type="file" accept="image/*" id="username" onChange={(e) => handleFile(e)} className="hidden" />
                    </label>

                    <Button
                        onClick={blogForm.handleSubmit((values: z.infer<typeof PostPostSchema>) =>
                            showPromise(handleSubmit(values), id ? 'Post actualizado' : 'Post publicado')
                        )}
                        className="max-w-32 h-8 gap-2"
                        size="sm"
                    >
                        <Upload className="size-3.5" />
                        Subir
                    </Button>
                    <Button className="size-8 sm:hidden" variant="ghost" size="icon" onClick={() => setOpen(false)}>
                        <X className="size-3.5" />
                    </Button>
                </DialogHeader>
                <Form {...blogForm}>
                    <form
                        onSubmit={blogForm.handleSubmit((values: z.infer<typeof PostPostSchema>) =>
                            showPromise(handleSubmit(values), id ? 'Post actualizado' : 'Post publicado')
                        )}
                        className="grid h-full overflow-y-auto p-2 sm:p-6 pt-1 "
                        style={{ gridTemplateRows: 'auto auto 1fr' }}
                    >
                        <FormField
                            control={blogForm.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Titulo" {...field} className="border-none font-semibold text-2xl" />
                                    </FormControl>
                                    <FormMessage className="h-5" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={blogForm.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Descripción" {...field} className="border-none h-8 text-muted-foreground" />
                                    </FormControl>
                                    <FormMessage className="h-5" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={blogForm.control}
                            name="body"
                            render={() => (
                                <FormItem>
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
            </DialogContent>
        </Dialog>
    );
};

export default BlogForm;
