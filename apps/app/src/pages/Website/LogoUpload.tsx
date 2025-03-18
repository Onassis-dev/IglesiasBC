// import { ActionButton, Button } from '@/components/ui/button';
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { api, api, tsr } from '@/lib/boilerplate';
// import { showPromise } from '@/lib/showFunctions.tsx';
// import { Image } from 'lucide-react';
// import { useState } from 'react';

// const LogoUpload = () => {
//     const [selectedFile, setSelectedFile] = useState<any>([]);
//     const [open, setOpen] = useState(false);

//     const handleFile = async (e: any) => {
//         const files = e.target.files;

//         if (files && files.length > 0) {
//             setSelectedFile(files[0]);
//         }
//     };

//     const handleSubmit = async () => {
//         const formData = new FormData();

//         formData.append('image', selectedFile);

//         await api.post('/certificates/logo', formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });

//         await api(tsr.certificates.uploadLogo, formData);

//         setOpen(false);
//     };

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//                 <ActionButton text="Subir logo">
//                     <Image className="size-3.5" />
//                 </ActionButton>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[425px]">
//                 <DialogHeader>
//                     <DialogTitle>Subir logo de tu iglesia</DialogTitle>
//                 </DialogHeader>
//                 <Input type="file" accept="image/*" id="username" onChange={(e) => handleFile(e)} />
//                 <DialogFooter>
//                     <Button type="submit" onClick={() => showPromise(handleSubmit(), 'Logo Subido')} size="sm">
//                         Subir
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default LogoUpload;
