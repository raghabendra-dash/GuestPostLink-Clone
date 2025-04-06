import mongoose from "mongoose";

const websiteSchema = new mongoose.Schema(
  {
    domain: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    domainRating: { type: Number, required: true },
    authorityScore: { type: Number, required: true },
    trustFlow: { type: Number, required: true },
    referringDomains: { type: Number, required: true },
    totalBacklinks: { type: Number, required: true },
    language: { type: String, required: true },
    spamScore: { type: String, required: true },
    linkValidity: { type: String, required: true },
    trafficByCountry: { type: String, required: true },
    minimumWordCount: { type: Number, required: true },
    completionRatio: { type: String, required: true },
    citationFlow: { type: Number, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Website = mongoose.model("Website", websiteSchema);

export default Website;
