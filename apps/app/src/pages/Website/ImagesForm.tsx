import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/boilerplate';
import { useEffect, useState } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import ChurchImage from './ChurchImage';
import ImageUpload from './ImageUpload';
import { useQueryStore } from '@/lib/store';

const ImagesForm = () => {
    const client = useQueryStore((queryClient) => queryClient.queryClient);
    const [selectedFile, setSelectedFile]: any = useState(null);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);

    const [images, setImages]: any = useState([]);
    const [pastorsImg, setPastorsImg] = useState('');
    const [coverImg, setCoverImg] = useState('');
    const [logo, setLogo] = useState('');

    const limit = 12;

    const func = async () => {
        const resultI = await api.get('/builder/images');
        setImages(resultI.data);
        const resultII = await api.get('/builder/pastorsimg');
        setPastorsImg(resultII.data[0]?.pastorsImg);
        const resultIII = await api.get('/builder/coverimg');
        setCoverImg(resultIII.data[0]?.coverImg);
        const resultIV = await api.get('/builder/logo');
        setLogo(resultIV.data[0]?.logo);
    };

    useEffect(() => {
        func();
    }, []);

    const fetchData = async () => {
        func();
        client.refetchQueries({ queryKey: ['pageInfo'] });
    };

    const sendPromise = (path: string) => showPromise(uploadImage(path), 'Imagen subida', 'Error al subir la imagen', 'Subiendo imagen');

    const uploadImage = async (path: string) => {
        const formData = new FormData();
        formData.append('image', selectedFile);

        console.log(selectedFile);
        if (!selectedFile) throw new Error('No se seleccionó ninguna imagen');

        await api.post(path, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        setOpen(false);
        setOpen2(false);
        setOpen3(false);
        setOpen4(false);

        client.refetchQueries({ queryKey: ['pageInfo'] });

        setSelectedFile(null);
        await fetchData();
    };

    useEffect(() => {
        setSelectedFile(null);
    }, [open, open2, open3, open4]);

    return (
        <Card className="max-w-full">
            <CardHeader>
                <CardTitle>Tu logo</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-1 w-full min-h-32 flex-col max-w-80">
                    <img src={logo} alt="" className="w-flex" />
                    <ImageUpload
                        text="Subir logo"
                        apiPath="/builder/logo"
                        edit={!!logo}
                        setSelectedFile={setSelectedFile}
                        uploadImage={sendPromise}
                        open={open4}
                        setOpen={setOpen4}
                    ></ImageUpload>
                </div>
            </CardContent>
            <CardHeader>
                <CardTitle>Imagen de fondo</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-1 w-full min-h-32 flex-col max-w-80">
                    <img src={coverImg} alt="" className="w-flex" />
                    <ImageUpload
                        text="Subir imagen de fondo"
                        apiPath="/builder/coverimg"
                        edit={!!coverImg}
                        setSelectedFile={setSelectedFile}
                        uploadImage={sendPromise}
                        open={open3}
                        setOpen={setOpen3}
                    ></ImageUpload>
                </div>
            </CardContent>
            <CardHeader>
                <CardTitle>Imagen del pastorado</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-1 w-full min-h-32 flex-col max-w-80">
                    <img src={pastorsImg} alt="" className="w-flex" />
                    <ImageUpload
                        text="Subir imagen del pastorado"
                        apiPath="/builder/pastorsimg"
                        edit={!!pastorsImg}
                        setSelectedFile={setSelectedFile}
                        uploadImage={sendPromise}
                        open={open2}
                        setOpen={setOpen2}
                    ></ImageUpload>
                </div>
            </CardContent>
            <CardHeader>
                <CardTitle>Galería de tu página</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
                    {images.map((image: any) => (
                        <ChurchImage key={image.img} url={image.img} fetchData={fetchData} />
                    ))}

                    {images.length < limit ? (
                        <ImageUpload
                            text="Subir imagen"
                            apiPath="/builder/image"
                            setSelectedFile={setSelectedFile}
                            uploadImage={sendPromise}
                            open={open}
                            setOpen={setOpen}
                        ></ImageUpload>
                    ) : (
                        <p>Has alcanzado el límite de imágenes</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ImagesForm;
