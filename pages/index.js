import Head from 'next/head'
import Link from 'next/link'
import MainLayout from '../components/Layouts/MainLayout'
import { sanityClient, urlFor } from '../lib/sanity'

const recipesQuery = `*[ _type == 'recipe']{
  _id,
  name,
  slug,
  mainImage
}`



export default function Home({ recipes }) {

  return (
    <MainLayout>
      <Head>
        <title>Andres Kitchen | home</title>
        <meta />
      </Head>

      <h1 className="px-20">Welcome to Andre's Kitchen</h1>

      <div className="px-20 lg:grid lg:grid-cols-2">
        {recipes?.length > 0 && recipes.map((recipe) => (

          <Link
            href={`/recipies/${recipe.slug.current}`}
            key={recipe._id}
          >
            <a>
              <div className="m-4 bg-white rounded-lg shadow-2xl md:flex lg:h-auto">
                <img
                  src={
                    urlFor(recipe.mainImage)
                      .width(200)
                      .height(200)
                      .url()}
                  alt="delivery bike at night"
                  className="w-full rounded-t-lg oject-cover md:w-1/3 md:rounded-t-none md:rounded-l-lg"
                />
                {/* content  */}
                <div className="p-6">
                  <h2 className="mb-2 font-bold text-orange-700 md:text-3xl">
                    {recipe.name}
                  </h2>
                  <p className="text-orange-700 ">This is a better card</p>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>

    </MainLayout>

  )
}

export async function getStaticProps() {
  const recipes = await sanityClient.fetch(recipesQuery)
  return {
    props: {
      recipes
    }
  }
}