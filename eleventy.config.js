import { DateTime } from "luxon";

export default function (eleventyConfig) {
  // --- Passthrough copies ---
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy({ "src/assets/favicon.svg": "favicon.svg" });
  eleventyConfig.addPassthroughCopy("src/CNAME");

  // --- Collections ---
  eleventyConfig.addCollection("reports", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/reports/**/*.md")
      .filter((item) => !item.data.draft)
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("tagList", function (collectionApi) {
    const tags = new Set();
    collectionApi.getAll().forEach((item) => {
      (item.data.tags || []).forEach((tag) => {
        if (tag !== "report") tags.add(tag);
      });
    });
    return [...tags].sort();
  });

  // --- Filters ---
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "yyyy-MM-dd"
    );
  });

  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toISO();
  });

  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array)) return [];
    return n < 0 ? array.slice(n) : array.slice(0, n);
  });

  eleventyConfig.addFilter("filterTagList", (tags) => {
    return (tags || []).filter((tag) => !["report", "reports"].includes(tag));
  });

  eleventyConfig.addFilter("excerpt", (content) => {
    if (!content) return "";
    const stripped = content.replace(/<[^>]*>/g, "");
    return stripped.length > 200
      ? stripped.substring(0, 200) + "..."
      : stripped;
  });

  // JSON filter for search index
  eleventyConfig.addFilter("jsonify", (obj) => {
    return JSON.stringify(obj);
  });

  // Slugify filter
  eleventyConfig.addFilter("slugify", (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  });

  // --- Directory config ---
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
