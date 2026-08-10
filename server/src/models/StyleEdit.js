const mongoose = require('mongoose');

const styleEditImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
  },
  { _id: false }
);

const styleEditSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    images: {
      type: [styleEditImageSchema],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    coverImageUrl: {
      type: String,
      required: [true, 'Cover image is required'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDisplayed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

styleEditSchema.index({ isActive: 1, isDisplayed: 1, startDate: 1, endDate: 1 });

styleEditSchema.pre('validate', function validateCoverImage(next) {
  if (!this.coverImageUrl || !Array.isArray(this.images)) {
    return next();
  }

  const imageUrls = this.images.map((item) => item.url);
  if (!imageUrls.includes(this.coverImageUrl)) {
    this.invalidate('coverImageUrl', 'Cover image must be one of the registered images');
  }

  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    this.invalidate('endDate', 'End date must be on or after start date');
  }

  return next();
});

const StyleEdit = mongoose.model('StyleEdit', styleEditSchema);

module.exports = StyleEdit;
