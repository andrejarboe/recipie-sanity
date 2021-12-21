import { useState } from 'react';
import { useRouter } from 'next/router'
import {
    sanityClient,
    urlFor,
    usePreviewSubscription,
    PortableText,

} from '../../lib/sanity'

const recipesQuery = `*[ _type == 'recipe' && slug.current == $slug][0]{
    _id,
    name,
    slug,
    mainImage,
    ingredient[]{
        _key,
        unit,
        wholeNumber,
        fraction,
        ingredient->{
            name
        }
    },
    instructions,
    likes
  }`

export default function OneRecipe({ data, preview }) {
    const router = useRouter()

    if (router.isFallback) return <div>Loading...</div>;
    
    
    const { data: recipe } = usePreviewSubscription(recipesQuery, {
        params: { slug: data.recipe?.slug.current },
        initialData: data,
        enabled: preview,
    });
    
    const [likes, setLikes] = useState(data?.recipes?.likes)

    const addLike = async () => {
        const res = await fetch('/api/handle-like', {
            method: "POST",
            body: JSON.stringify({ _id: recipe._id }),
        }).catch((error) => console.log(error))

        const data = await res.json();

        setLikes(data?.likes)
    }

    // const { recipe } = data;

    return (
        <article className='p-20 min-h-screen '>
            <div className="container mx-auto max-w-6xl">
                {/* title */}
                <h1 className="text-4xl font-bold mb-4">{recipe?.name}</h1>

                <button
                    className='border border-gray-400'
                    onClick={addLike}
                >
                    {likes} ❤️
                </button>

                <div className="flex space-x-2">
                    {/* img  */}
                    <img
                        className='w-1/2 border border-gray-400 shadow-lg'
                        src={urlFor(recipe?.mainImage).url()} alt={recipe?.name} />
                    {/* ingredients */}
                    <div className="flex p-8 flex-row w-1/2 border border-gray-400">
                        <div className="flex flex-col w-1/3 h-full">
                            {recipe.ingredient?.map((ingredient) => (
                                <div
                                    key={ingredient._key}
                                    className='mb-4'
                                >
                                    {ingredient?.wholeNumber}
                                    {' '}
                                    {ingredient?.fraction}
                                    {' '}
                                    {ingredient?.unit}
                                    <br />
                                    {ingredient?.ingredient?.name}
                                </div>
                            ))}
                        </div>
                        {/* instructions  */}
                        <PortableText
                            className='pl-8 flex-grow border-l border-gray-400'
                            blocks={recipe?.instructions} />
                    </div>
                </div>
            </div>
        </article>
    )
}

export async function getStaticPaths() {
    const paths = await sanityClient.fetch(
        `*[type == 'recipe' && defined(slug.current)]{
            'params': {
                'slug': slug.current
            }
        }`
    )

    return {
        paths,
        fallback: true
    }
}

export async function getStaticProps({ params }) {
    const { slug } = params;
    const recipe = await sanityClient.fetch(recipesQuery, { slug })

    return {
        props: {
            data: {
                recipe
            },
            preview: true
        }
    }
}