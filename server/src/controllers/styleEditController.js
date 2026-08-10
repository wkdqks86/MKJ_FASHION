const StyleEdit = require('../models/StyleEdit');

const handleError = (error, res) => {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid style edit id' });
  }

  console.error(error);
  return res.status(500).json({ success: false, message: 'Internal server error' });
};

const normalizeDateStart = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const normalizeDateEnd = (value) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
};

const parseImages = (images) => {
  if (!Array.isArray(images)) return [];

  return images
    .map((item) => {
      if (typeof item === 'string') return { url: item.trim() };
      if (item?.url) return { url: String(item.url).trim() };
      return null;
    })
    .filter((item) => item?.url);
};

const getActiveStyleEdit = async (req, res) => {
  try {
    const now = new Date();

    const styleEdit = await StyleEdit.findOne({
      isActive: true,
      isDisplayed: { $ne: false },
      startDate: { $lte: now },
      endDate: { $gte: now },
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!styleEdit) {
      return res.json({ success: true, styleEdit: null });
    }

    const carouselImages = styleEdit.images
      .map((item) => item.url)
      .filter((url) => url !== styleEdit.coverImageUrl);

    return res.json({
      success: true,
      styleEdit: {
        ...styleEdit,
        carouselImages: carouselImages.length > 0 ? carouselImages : styleEdit.images.map((item) => item.url),
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

const getStyleEdits = async (req, res) => {
  try {
    const styleEdits = await StyleEdit.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json({ success: true, styleEdits });
  } catch (error) {
    handleError(error, res);
  }
};

const getStyleEditById = async (req, res) => {
  try {
    const styleEdit = await StyleEdit.findOne({ _id: req.params.id, isActive: true });

    if (!styleEdit) {
      return res.status(404).json({ success: false, message: 'Style edit not found' });
    }

    return res.json({ success: true, styleEdit });
  } catch (error) {
    handleError(error, res);
  }
};

const createStyleEdit = async (req, res) => {
  try {
    const { title, startDate, endDate, images, coverImageUrl } = req.body;
    const parsedImages = parseImages(images);

    if (!title?.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Start and end dates are required' });
    }
    if (parsedImages.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one image is required' });
    }
    if (!coverImageUrl?.trim()) {
      return res.status(400).json({ success: false, message: 'Cover image is required' });
    }

    const styleEdit = await StyleEdit.create({
      title: title.trim(),
      startDate: normalizeDateStart(startDate),
      endDate: normalizeDateEnd(endDate),
      images: parsedImages,
      coverImageUrl: coverImageUrl.trim(),
    });

    return res.status(201).json({
      success: true,
      message: 'Style edit created',
      styleEdit,
    });
  } catch (error) {
    handleError(error, res);
  }
};

const updateStyleEdit = async (req, res) => {
  try {
    const allowedFields = ['title', 'startDate', 'endDate', 'images', 'coverImageUrl', 'isDisplayed'];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.title !== undefined && !String(updates.title).trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    if (updates.title !== undefined) updates.title = updates.title.trim();
    if (updates.startDate !== undefined) updates.startDate = normalizeDateStart(updates.startDate);
    if (updates.endDate !== undefined) updates.endDate = normalizeDateEnd(updates.endDate);
    if (updates.images !== undefined) {
      updates.images = parseImages(updates.images);
      if (updates.images.length === 0) {
        return res.status(400).json({ success: false, message: 'At least one image is required' });
      }
    }
    if (updates.coverImageUrl !== undefined) updates.coverImageUrl = updates.coverImageUrl.trim();

    const styleEdit = await StyleEdit.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      updates,
      { new: true, runValidators: true }
    );

    if (!styleEdit) {
      return res.status(404).json({ success: false, message: 'Style edit not found' });
    }

    return res.json({ success: true, message: 'Style edit updated', styleEdit });
  } catch (error) {
    handleError(error, res);
  }
};

const deleteStyleEdit = async (req, res) => {
  try {
    const styleEdit = await StyleEdit.findByIdAndUpdate(
      req.params.id,
      { isActive: false, isDisplayed: false },
      { new: true }
    );

    if (!styleEdit) {
      return res.status(404).json({ success: false, message: 'Style edit not found' });
    }

    return res.json({ success: true, message: 'Style edit deleted' });
  } catch (error) {
    handleError(error, res);
  }
};

module.exports = {
  getActiveStyleEdit,
  getStyleEdits,
  getStyleEditById,
  createStyleEdit,
  updateStyleEdit,
  deleteStyleEdit,
};
