import { Request, Response } from 'express';
import Banner from '../models/banner.model'

async function GET_BANNER(req: Request, res: Response) {
    const page = req.query.p || 0;
    const showLimit: number = 3;
    // limit(showLimit).skip(Number(page) * showLimit)
    Banner.find({})
        .then((data) => {
            res.status(200).send(data);
        })
        .catch(() => {
            res.status(500).send({ message: "Could not fetch the documents" });
        });
}


async function POST_BANNER(req: Request, res: Response) {
    console.log('req.body', req.body.thumbnail, req.file)
    const banner = new Banner(req.body);
    // upload 1 ảnh
    if (req.file) {
        console.log('req.file', req.file)
        banner.thumbnail = req.file.filename;
    }
    await banner
        .save()
        .then((add) => {
            res.status(200).send(add);
        })
        .catch((error) => {
            console.log(error);
            return;
        });
}



function PUT_BANNER(req: Request, res: Response) {
    console.log('req', req.params.id, req.body)
    if (req.file) {
        console.log('req.file', req.file)
        // banner.thumbnail = req.file.filename;
    }
    Banner.findByIdAndUpdate(req.params.id, req.body)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((error) => {
            console.log(error);
        });
}

async function DELETE_BANNER(req: Request, res: Response) {
    await Banner.findByIdAndDelete(req.params.id)
        .then((deleted) => {
            res.status(200).json("Delete Success");
        })
        .catch((error) => {
            console.log(error);
        });
}

export {
    GET_BANNER,
    POST_BANNER,
    PUT_BANNER,
    DELETE_BANNER
}