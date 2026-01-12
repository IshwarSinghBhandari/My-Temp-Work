"use client";

import {
  getAllCategory,
  getAllSlugs,
  getBlogByCategoryId,
} from "@/app/(lib)/api";
import { toPascalCase } from "@/app/(lib)/types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const RecentBlogs = ({ serviceCategoryProps }) => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const [blogsLength, setBlogsLength] = useState(false);

  // Utility: Decode HTML entities (unchanged)
  const decodeHtmlEntities = (text) => {
    return text.replace(/&#8211;/g, "–");
  };

  useEffect(() => {
    const apiFunction = async () => {
      try {
        let blogsToDisplay = [];
        let remainingBlogsCount = 0;

        // If no category selected → show latest blogs
        if (serviceCategoryProps === "") {
          const allBlogs = await getAllSlugs(3);
          setBlogs(allBlogs);
          return;
        }

        const categories = await getAllCategory(100);
        const category = categories.find(
          (cat) => cat.slug === serviceCategoryProps
        );

        if (category) {
          const blogs = await getBlogByCategoryId(category.id, 3);

          // If category has less than 3 blogs → fill with others
          if (blogs.length < 3) {
            remainingBlogsCount = 3 - blogs.length;
            const additionalBlogs = await getAllSlugs(remainingBlogsCount);
            setBlogsLength(false);
            blogsToDisplay = [...blogs, ...additionalBlogs];
          } else {
            setBlogsLength(true);
            blogsToDisplay = blogs;
          }
          setBlogs(blogsToDisplay);
        } else {
          const allBlogs = await getAllSlugs(3);
          setBlogs(allBlogs);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("An error occurred while fetching blogs.");
      }
    };

    apiFunction();
  }, [serviceCategoryProps]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <div className="py-[51px] flex flex-col justify-center items-center">
        <p className="text-center font-bold text-[32px]">Recent Blogs</p>

        <hr className="w-[57px] mx-auto my-1 border-2 border-[#DA3643]" />

        <div className="lg:px-[105px] max-md:px-[24px] max-md:py-[26px] lg:py-[51px] lg:grid lg:grid-cols-3 gap-y-[40px] gap-x-[25px]">
          {blogs.length > 0 ? (
            blogs.map((blog: any) => (
              <div
                key={blog.id}
                /* UI CHANGE: Card elevation, smooth hover, rounded corners */
                className="max-md:mb-5 bg-white border border-gray-200 rounded-[14px]
                           overflow-hidden transition-all duration-300 ease-out
                           hover:-translate-y-2 hover:shadow-xl"
              >
                <Link
                  href={`/blogs/[blog.slug]`}
                  as={`/blogs/${blog.slug}`}
                  className="group"
                >
                  {/* IMAGE SECTION */}
                  <div
                    /* UI CHANGE: overflow hidden for image zoom effect */
                    className="relative h-[212px] w-full overflow-hidden"
                  >
                    <Image
                      src={blog.jetpack_featured_media_url}
                      alt="blogPoster"
                      fill
                      /* UI CHANGE: smooth zoom on hover */
                      className="rounded-t-[14px] object-cover
                                 transition-transform duration-500 ease-out
                                 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* CATEGORY TAG */}
                  <div className="pt-[20px] flex justify-between items-center px-4">
                    <div
                      /* UI CHANGE: modern pill-style tag */
                      className="flex items-center text-xs
                                 bg-gray-100/80 backdrop-blur
                                 rounded-full px-3 py-1
                                 border border-gray-200"
                    >
                      {blogsLength ? (
                        <span className="text-[#6C6C6C] text-[12px] font-normal">
                          {toPascalCase(serviceCategoryProps)}
                        </span>
                      ) : (
                        blog.yoast_head_json?.schema?.["@graph"]?.find(
                          (item: any) =>
                            item["@type"] === "Article" && item.articleSection
                        )?.articleSection?.[0] ?? (
                          <span className="text-[#6C6C6C] text-[12px] font-normal">
                            Other Blogs
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="py-[20px] flex flex-col gap-[10px] px-4">
                    <h2
                      /* UI CHANGE: smoother hover color transition */
                      className="text-[24px] font-semibold leading-snug line-clamp-2
                                 transition-colors duration-300
                                 group-hover:text-[#DA3643]"
                    >
                      {blog.title
                        ? decodeHtmlEntities(blog.title.rendered)
                        : "Blog Name"}
                    </h2>

                    <div
                      /* UI CHANGE: softer text color for readability */
                      className="text-[16px] font-normal text-gray-600 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: blog.excerpt.rendered,
                      }}
                    />
                  </div>
                </Link>
                {/* <Link
                  href={`/author/${blog.author_slug}`}
                  as={`/author/${blog.author_slug}`}
                  className="flex gap-4 items-center px-4 pb-4"
                >
                  <div className="relative h-[53px] w-[53px]">
                    <Image
                      src={blog.author_avatar_url}
                      alt="authorAvatar"
                      fill
                      className="rounded-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <p className="text-[14px] font-normal">
                      {blog.author_name ? blog.author_name : "Author"}
                    </p>
                  </div>
                </Link> */}
              </div>
            ))
          ) : (
            <p>No blogs found for this category.</p>
          )}
        </div>

        {/* CTA BUTTON */}
        <Link
          href={"/blogs"}
          /* UI CHANGE: modern hover interaction */
          className="border border-gray-300 rounded-[10px]
                     text-gray-700 px-5 py-2
                     transition-all duration-300
                     hover:border-[#DA3643] hover:text-[#DA3643]
                     hover:shadow-md hover:-translate-y-[1px]"
        >
          Explore All
        </Link>
      </div>
    </>
  );
};

export default RecentBlogs;
