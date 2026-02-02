import { defineField, defineType } from "sanity";

export default defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "client",
      title: "Client Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "industry",
      title: "Industry",
      type: "string",
      options: {
        list: [
          { title: "Finance", value: "finance" },
          { title: "Healthcare", value: "healthcare" },
          { title: "E-commerce", value: "ecommerce" },
          { title: "Education", value: "education" },
          { title: "Real Estate", value: "realestate" },
          { title: "Logistics", value: "logistics" },
          { title: "Manufacturing", value: "manufacturing" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Brief summary for cards and previews",
    }),
    defineField({
      name: "challenge",
      title: "The Challenge",
      type: "array",
      of: [{ type: "block" }],
      description: "What problem did the client face?",
    }),
    defineField({
      name: "solution",
      title: "Our Solution",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
      description: "How did we solve it?",
    }),
    defineField({
      name: "results",
      title: "Results",
      type: "array",
      of: [{ type: "block" }],
      description: "What were the outcomes?",
    }),
    defineField({
      name: "metrics",
      title: "Key Metrics",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "value", type: "string", title: "Value (e.g., 300%)" },
            {
              name: "label",
              type: "string",
              title: "Label (e.g., Revenue Increase)",
            },
          ],
        },
      ],
      description: "Quantifiable results to display",
    }),
    defineField({
      name: "testimonial",
      title: "Client Testimonial",
      type: "object",
      fields: [
        { name: "quote", type: "text", title: "Quote" },
        { name: "author", type: "string", title: "Author Name" },
        { name: "role", type: "string", title: "Author Role" },
        {
          name: "avatar",
          type: "image",
          title: "Author Avatar",
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: "services",
      title: "Services Used",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Web Development", value: "web-development" },
          { title: "AI Solutions", value: "ai-solutions" },
          { title: "Automation", value: "automation" },
          { title: "UI/UX Design", value: "ui-ux-design" },
          { title: "SEO & Marketing", value: "seo-marketing" },
          { title: "Custom Software", value: "custom-software" },
        ],
      },
    }),
    defineField({
      name: "technologies",
      title: "Technologies",
      type: "array",
      of: [{ type: "string" }],
      description: "Tech stack used (e.g., Next.js, Prisma, Paystack)",
    }),
    defineField({
      name: "projectDuration",
      title: "Project Duration",
      type: "string",
      description: 'e.g., "6 weeks" or "3 months"',
    }),
    defineField({
      name: "projectValue",
      title: "Project Value (NGN)",
      type: "number",
      description: "For internal reference only - not displayed publicly",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Show on homepage?",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        { name: "metaTitle", type: "string", title: "Meta Title" },
        {
          name: "metaDescription",
          type: "text",
          title: "Meta Description",
          rows: 3,
        },
        { name: "ogImage", type: "image", title: "OG Image" },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      client: "client",
      media: "heroImage",
    },
    prepare(selection) {
      const { title, client, media } = selection;
      return {
        title,
        subtitle: client,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Published Date, New",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
