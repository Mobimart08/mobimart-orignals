import * as searchService from '../services/search.service.js';

export const searchProducts = async (req, res, next) => {
  try {
    const data = await searchService.fullTextSearch(req.query);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    const data = await searchService.getSearchSuggestions(q);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
