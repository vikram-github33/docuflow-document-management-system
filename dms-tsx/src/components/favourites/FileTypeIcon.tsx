import React from 'react';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon    from '@mui/icons-material/PictureAsPdf';
import ImageIcon           from '@mui/icons-material/Image';
import TableChartIcon      from '@mui/icons-material/TableChart';
import ArticleIcon         from '@mui/icons-material/Article';
import SlideshowIcon       from '@mui/icons-material/Slideshow';
import TextSnippetIcon     from '@mui/icons-material/TextSnippet';

interface Props { fileType: string; color: string; size?: number }

export const FileTypeIcon: React.FC<Props> = ({ fileType, color, size = 20 }) => {
  const sx = { fontSize: size, color, flexShrink: 0 };
  if (fileType === 'application/pdf')                              return <PictureAsPdfIcon sx={sx} />;
  if (fileType.startsWith('image/'))                              return <ImageIcon sx={sx} />;
  if (fileType.includes('sheet') || fileType.includes('csv'))     return <TableChartIcon sx={sx} />;
  if (fileType.includes('word') || fileType.includes('document')) return <ArticleIcon sx={sx} />;
  if (fileType.includes('presentation'))                          return <SlideshowIcon sx={sx} />;
  if (fileType === 'text/plain')                                  return <TextSnippetIcon sx={sx} />;
  return <InsertDriveFileIcon sx={sx} />;
};
