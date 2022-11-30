import PostModel from "../models/Post.js";


export const getLastTags = async(req,res)=>{
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts
            .map(obj=> obj.tags )
            .flat()
            .slice(0,5)

        res.json(tags)
    } catch (error) {
        res.status(500).json({
            message: "can't getAll posts"
        })
    }
}


export const getAll = async(req,res)=>{
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts)
    } catch (error) {
        res.status(500).json({
            message: "can't getAll posts"
        })
    }
}

export const getOne = async(req,res)=>{
    try {

        const postId = req.params.id;
        
        PostModel.findOneAndUpdate(
            {
            _id:postId,
            },{
            $inc:{ viewsCount: 1}
            },
            {
            returnDocument:'after',
            },
            (err,doc)=>{
                if(err){
                    return res.status(500).json({
                        message: "can't return post"
                    })
                }

                if(!doc){
                    return res.status(404).json({
                        message: "havn't did post"
                    })
                }
                res.json(doc)
            }
        ).populate('user');

    } catch (error) {
        res.status(500).json({
            message: "can't getAll posts"
        })
    }
}

export const remove = async(req,res)=>{
    try {
        const postId = req.params.id;
        
        PostModel.findByIdAndDelete({
            _id:postId
        },(err,doc)=>{
            if(err){
                return res.status(500).json({
                    message: "can't remove post"
                })
            }

            if(!doc){
                return res.status(404).json({
                    message: "havn't did post"
                })
            }

            return res.status(200).json({
                success:true
            })
        })
       

    } catch (error) {
        res.status(500).json({
            message: "can't getAll posts"
        })
    }
}



export const create = async (req,res)=>{
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({
            message: "can't create new post"
        })
    }
}


export const update = async (req,res)=>{
    try {
        const postId = req.params.id;
        
        await PostModel.updateOne({
            _id: postId,
        }, 
        {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.userId,
            tags: req.body.tags.split(','),
        });

        res.json({
            success: true
        })

    } catch (error) {
        res.status(500).json({
            message: "can't update post"
        })
    }
}





//   post comments controller

export const updateComment = async (req,res)=>{
    try {
        const postId = req.body.postId;
        
        const {comments} = await PostModel.findById(postId)
        
        await PostModel.updateOne({
            _id: postId,
        },{
            comments:[...comments,
                {
                    text: req.body.text,
                    writer: req.body.writer
                }]
        });


        res.json({
            success: true
        })

    } catch (error) {
        res.status(500).json({
            message: "can't update comments"
        })
    }
}