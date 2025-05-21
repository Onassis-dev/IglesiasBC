import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api, tsr } from '@/lib/boilerplate';
import { useEffect, useState } from 'react';
import { showPromise } from '@/lib/showFunctions.tsx';
import ImageUpload from './ImageUpload';
import { Button } from '@/components/ui/button';
import DeleteDialog from '@/components/common/DeleteDialog';
import { cn } from '@/lib/utils';

type ApiPath = 'uploadChurchImage' | 'uploadPastorsImg' | 'uploadCoverImg' | 'uploadLogo';

const deleteFuncs = {
    logo: tsr.builder.deleteLogo.mutate,
    pastorsImg: tsr.builder.deletePastorsImg.mutate,
    coverImg: tsr.builder.deleteCoverImg.mutate,
};

const placeholder = '/placeholder.svg';

const ImagesForm = () => {
    const client = tsr.useQueryClient();
    const [selectedFile, setSelectedFile]: any = useState(null);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [open5, setOpen5] = useState(false);

    const [selectedImage, setSelectedImage] = useState<keyof typeof deleteFuncs>('logo');

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
        <>
            <Card className="max-w-full p-4 space-y-4">
                <Card className="max-w-full">
                    <CardHeader>
                        <CardTitle>Tu logo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col">
                            <img
                                src={logo || placeholder}
                                alt="logo"
                                className={cn(
                                    'object-contain object-center max-h-32 max-w-full mx-auto mb-4 rounded-lg border',
                                    !logo && 'h-32 w-32'
                                )}
                            />
                            <div className={cn('grid sm:grid-cols-2 gap-2', !logo && '!grid-cols-1')}>
                                <ImageUpload
                                    text="Subir logo"
                                    apiPath="uploadLogo"
                                    edit={true}
                                    setSelectedFile={setSelectedFile}
                                    uploadImage={sendPromise}
                                    open={open4}
                                    setOpen={setOpen4}
                                    aspectRatio="max-h-64 object-contain"
                                ></ImageUpload>
                                {logo && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedImage('logo');
                                            setOpen5(true);
                                        }}
                                    >
                                        Eliminar
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Imagen del pastorado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col">
                            <img
                                src={pastorsImg || placeholder}
                                alt="pastors image"
                                className={'aspect-square object-cover object-center max-w-64 w-full mx-auto mb-4 rounded-lg border'}
                            />
                            <div className={cn('grid sm:grid-cols-2 gap-2', !pastorsImg && '!grid-cols-1')}>
                                <ImageUpload
                                    text="Subir imagen del pastorado"
                                    apiPath="uploadPastorsImg"
                                    edit={true}
                                    setSelectedFile={setSelectedFile}
                                    uploadImage={sendPromise}
                                    open={open2}
                                    setOpen={setOpen2}
                                    aspectRatio="aspect-square"
                                ></ImageUpload>
                                {pastorsImg && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedImage('pastorsImg');
                                            setOpen5(true);
                                        }}
                                    >
                                        Eliminar
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Imagen de fondo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col">
                            <img
                                src={coverImg || placeholder}
                                alt="cover image"
                                className="aspect-video object-cover object-center max-w-full mx-auto mb-4 rounded-lg border w-full"
                            />
                            <div className={cn('grid sm:grid-cols-2 gap-2', !coverImg && '!grid-cols-1')}>
                                <ImageUpload
                                    text="Subir imagen de fondo"
                                    apiPath="uploadCoverImg"
                                    edit={true}
                                    setSelectedFile={setSelectedFile}
                                    uploadImage={sendPromise}
                                    open={open3}
                                    setOpen={setOpen3}
                                    aspectRatio="aspect-video"
                                ></ImageUpload>
                                {coverImg && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedImage('coverImg');
                                            setOpen5(true);
                                        }}
                                    >
                                        Eliminar
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Card>

            <DeleteDialog
                text="¿Estás seguro de querer eliminar esta imagen?"
                open={open5}
                setOpen={setOpen5}
                successMessage="Imagen eliminada"
                func={deleteFuncs[selectedImage]}
                queryKey={selectedImage}
            />
        </>
    );
};

export default ImagesForm;
