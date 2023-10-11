import { Request, Response } from 'express';
import Categories from '../models/category.model'

async function GET_CATEGORIES(req: Request, res: Response) {
    const page = req.query.p || 0;
    const showLimit: number = 3;
    Categories.find({}).limit(showLimit).skip(Number(page) * showLimit)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch(() => {
            res.status(500).send({ message: "Could not fetch the documents" });
        });
}


async function POST_CATEGORIES(req: Request, res: Response) {
    console.log(req.body.name);
    const categories = new Categories(req.body);
    await categories
        .save()
        .then((add) => {
            res.json(add);
        })
        .catch((error) => {
            console.log(error);
            return;
        });
}



function PUT_CATEGORIES(req: Request, res: Response) {
    Categories.findByIdAndUpdate(req.params.id, req.body)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((error) => {
            console.log(error);
        });
}

async function DELETE_CATEGORIES(req: Request, res: Response) {
    await Categories.findByIdAndDelete(req.params.id)
        .then((deleted) => {
            res.status(200).json("Delete Success");
        })
        .catch((error) => {
            console.log(error);
        });
}

export {
    GET_CATEGORIES,
    POST_CATEGORIES,
    PUT_CATEGORIES,
    DELETE_CATEGORIES
}