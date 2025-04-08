import Website from "../models/website.model.js";
import Cart from "../models/cart.model.js";

export const create = async (req, res) => {
  try {
    const {
      domain,
      title,
      domainRating,
      authorityScore,
      trustFlow,
      referringDomains,
      totalBacklinks,
      language,
      spamScore,
      linkValidity,
      trafficByCountry,
      minimumWordCount,
      completionRatio,
      citationFlow,
      price,
      category,
      country,
      description,
    } = req.body;

    const website = await Website.findOne({ domain });
    if (website) {
      return res.status(400).send({ message: "Website already exists" });
    }

    const newWebsite = await new Website({
      domain,
      title,
      domainRating,
      authorityScore,
      trustFlow,
      referringDomains,
      totalBacklinks,
      language,
      spamScore,
      linkValidity,
      trafficByCountry,
      minimumWordCount,
      completionRatio,
      citationFlow,
      price,
      category,
      country,
      description,
    });

    await newWebsite.save();
    res.status(201).json({ success: true, message: "Website created" });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Website.",
    });
  }
};

export const fetchAll = async (req, res) => {
  try {
    const query = {};
    const { category, country, minPrice, maxPrice, keyword } = req.query;

    if (category) query.category = category;
    if (country) query.country = country;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } }, // Case-insensitive title search
        { description: { $regex: keyword, $options: "i" } },
        { domain: { $regex: keyword, $options: "i" } },
      ];
    }

    const websites = await Website.find(query);
    res.status(200).json({ success: true, websites });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while fetching the websites.",
    });
  }
};

export const getWebsite = async (req, res) => {
  try {
    const { id } = req.params;
    const website = await Website.findById(id);
    if (!website) {
      return res
        .status(404)
        .json({ success: false, message: "Website not found" });
    }
    res.status(200).json({ success: true, website });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while fetching the website.",
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { userId, websiteId } = req.body;
    const website = await Website.findById(websiteId);
    if (!website) {
      return res
        .status(404)
        .json({ success: false, message: "Website not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        websites: [{ websiteId: website._id, price: website.price }],
      });
    } else {
      const existingItem = cart.websites.find(
        (item) => item.websiteId.toString() === websiteId
      );
      if (existingItem) {
        return res
          .status(400)
          .json({ success: false, message: "Website already in cart" });
      }

      cart.websites.push({ websiteId: website._id, price: website.price });
    }

    await cart.save();

    res
      .status(200)
      .json({ success: true, message: "Website added to cart", cart });
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while adding the website to the cart.",
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { websiteId } = req.params;
    const { userId } = req.query; 

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const existingItem = cart.websites.find(
      (item) => item.websiteId.toString() === websiteId
    );
    if (!existingItem) {
      return res
        .status(404)
        .json({ success: false, message: "Website not in cart" });
    }

    cart.websites = cart.websites.filter(
      (item) => item.websiteId.toString() !== websiteId
    );

    await cart.save();

    res
      .status(200)
      .json({ success: true, message: "Website removed from cart", cart });
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while removing the website from the cart.",
    });
  }
};
