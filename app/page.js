"use client";

import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import Image from "next/image";
import axios from "axios";
import RecipeCard from "@/components/RecipeCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Index = () => {
  const [formData, setFormData] = useState({
    allergy: "",
    cuisine: "",
    firstIngredient: "",
    secondIngredient: "",
    thirdIngredient: "",
  });

  const router = useRouter();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session) router.push("/sign-in");
  }, [session, status, router]);

  const { mutate, isLoading, isError, data } = useMutation(fetchRecipes);

  async function fetchRecipes(formData) {
    try {
      const response = await axios.post("/api/recipes", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message || "Failed to fetch recipes");
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  console.log(session);

  return (
    <>
      {session && (
        <div>
          <p>Email: {session.user.email}</p>
          <button
            type="submit"
            className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-black"
            onClick={async () =>
              await signOut({ callbackUrl: "http://localhost:3000/sign-in" })
            }
          >
            Sign Out
          </button>
        </div>
      )}
      {session && (
        <div className="container mx-auto mt-10">
          <div className="p-5 bg-white shadow-md rounded-md">
            <form onSubmit={handleSubmit}>
              <p className="text-3xl font-semibold mb-5">
                Tell me, what is your-
              </p>
              <input
                type="text"
                name="firstIngredient"
                className="input-field mb-3"
                placeholder="First ingredient"
                autoComplete="off"
                value={formData.firstIngredient}
                onChange={handleChange}
              />
              <input
                type="text"
                name="secondIngredient"
                className="input-field mb-3"
                placeholder="Second ingredient"
                autoComplete="off"
                value={formData.secondIngredient}
                onChange={handleChange}
              />
              <input
                type="text"
                name="thirdIngredient"
                className="input-field mb-3"
                placeholder="Third ingredient"
                autoComplete="off"
                value={formData.thirdIngredient}
                onChange={handleChange}
              />
              <input
                type="text"
                name="allergy"
                className="input-field mb-3"
                placeholder="Dietary restriction"
                autoComplete="off"
                value={formData.allergy}
                onChange={handleChange}
              />
              <input
                type="text"
                name="cuisine"
                className="input-field mb-3"
                placeholder="Cuisine"
                autoComplete="off"
                value={formData.cuisine}
                onChange={handleChange}
              />
              <button type="submit" className="btn-primary">
                Make a recipe for me!
              </button>
            </form>
          </div>
          {isLoading && (
            <Image
              src="/frying-pan.gif"
              height={500}
              width={500}
              alt="frying-pan"
              className="mx-auto my-20"
            />
          )}
          {data && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
              {data.recommendations.map((recipe, index) => (
                <RecipeCard key={index} recipe={{ ...recipe, id: index }} />
              ))}
            </div>
          )}
          {isError && (
            <div className="container text-center">
              <p className="text-3xl">
                Could not find a recipe! Please try again.
              </p>
              <Image src="/error.gif" height={50} width={50} alt="frying-pan" />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Index;
