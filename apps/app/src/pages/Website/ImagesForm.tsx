import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api, tsr } from '@/lib/boilerplate';
import { useEffect, useState } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import ImageUpload from './ImageUpload';

type ApiPath = 'uploadChurchImage' | 'uploadPastorsImg' | 'uploadCoverImg' | 'uploadLogo';

const ImagesForm = () => {
    const client = tsr.useQueryClient();
    const [selectedFile, setSelectedFile]: any = useState(null);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);

    const { data: pastorsImgData } = tsr.builder.getPastorsImg.useQuery({
        queryKey: ['pastorsImg'],
    });
    const pastorsImg = pastorsImgData?.body?.[0]?.pastorsImg || '';

    const { data: coverImgData } = tsr.builder.getCoverImg.useQuery({
        queryKey: ['coverImg'],
    });
    const coverImg = coverImgData?.body?.[0]?.coverImg || '';

    const { data: logoData } = tsr.builder.getLogo.useQuery({
        queryKey: ['logo'],
    });
    const logo = logoData?.body?.[0]?.logo || '';

    const fetchData = () => {
        client.refetchQueries({ queryKey: ['churchImages'] });
        client.refetchQueries({ queryKey: ['pastorsImg'] });
        client.refetchQueries({ queryKey: ['coverImg'] });
        client.refetchQueries({ queryKey: ['logo'] });
        client.refetchQueries({ queryKey: ['pageInfo'] });
    };

    const sendPromise = (apiPath: ApiPath) => showPromise(uploadImage(apiPath), 'Imagen subida', 'Subiendo imagen');

    const uploadImage = async (apiPath: ApiPath) => {
        if (!selectedFile) throw new Error('No se seleccionó ninguna imagen');

        await api(tsr.builder[apiPath], { image: selectedFile });

        setOpen(false);
        setOpen2(false);
        setOpen3(false);
        setOpen4(false);

        setSelectedFile(null);
        fetchData();
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
                    <img src={logo} alt="" />
                    <ImageUpload
                        text="Subir logo"
                        apiPath="uploadLogo"
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
                    <img src={coverImg} alt="" />
                    <ImageUpload
                        text="Subir imagen de fondo"
                        apiPath="uploadCoverImg"
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
                    <img src={pastorsImg} alt="" className="aspect-square object-cover" />
                    <ImageUpload
                        text="Subir imagen del pastorado"
                        apiPath="uploadPastorsImg"
                        edit={!!pastorsImg}
                        setSelectedFile={setSelectedFile}
                        uploadImage={sendPromise}
                        open={open2}
                        setOpen={setOpen2}
                    ></ImageUpload>
                </div>
            </CardContent>
            {/* <CardHeader>
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
                            apiPath="uploadChurchImage"
                            setSelectedFile={setSelectedFile}
                            uploadImage={sendPromise}
                            open={open}
                            setOpen={setOpen}
                        ></ImageUpload>
                    ) : (
                        <p>Has alcanzado el límite de imágenes</p>
                    )}
                </div>
            </CardContent> */}
        </Card>
    );
};

export default ImagesForm;
