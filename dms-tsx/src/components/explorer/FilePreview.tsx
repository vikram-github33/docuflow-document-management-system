import React, { useState } from 'react';
import {
  Box, Typography, Button, Divider, Chip,
  Paper, IconButton, Tooltip,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { getFileIconConfig, formatFileSize, timeAgo } from '../../utils/fileIcons';
import type { FolderDocument } from '../../types/folder.types';

interface FilePreviewProps {
  doc: FolderDocument;
  folderId: string;
}

function PdfPreview({ url }: { url: string }) {
  return (
    <Box
      component="iframe"
      src={url}
      title="PDF preview"
      sx={{
        width: '100%',
        flex: 1,
        border: 'none',
        borderRadius: 1,
        minHeight: 0,
      }}
    />
  );
}

function ImagePreview({ url, fileName }: { url: string; fileName: string }) {
  const [zoom, setZoom] = useState(100);
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minHeight: 0 }}>
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
        <Tooltip title="Zoom in">
          <IconButton size="small" onClick={() => setZoom(z => Math.min(z + 25, 300))}>
            <ZoomInIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Typography variant="caption" color="text.secondary">{zoom}%</Typography>
        <Tooltip title="Zoom out">
          <IconButton size="small" onClick={() => setZoom(z => Math.max(z - 25, 25))}>
            <ZoomOutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Button size="small" sx={{ ml: 'auto', fontSize: 11 }} onClick={() => setZoom(100)}>
          Reset
        </Button>
      </Box>
      <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', bgcolor: 'grey.100', borderRadius: 1, p: 1 }}>
        <Box
          component="img"
          src={url}
          alt={fileName}
          sx={{
            width: `${zoom}%`,
            maxWidth: zoom > 100 ? 'none' : '100%',
            height: 'auto',
            borderRadius: 1,
            boxShadow: 1,
          }}
        />
      </Box>
    </Box>
  );
}

function UnsupportedPreview({ doc }: { doc: FolderDocument }) {
  const cfg = getFileIconConfig(doc.fileType);
  return (
    <Box sx={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 2,
      bgcolor: 'grey.50', borderRadius: 2, border: '0.5px dashed', borderColor: 'divider',
    }}>
      <InsertDriveFileIcon sx={{ fontSize: 64, color: cfg.color, opacity: 0.4 }} />
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" fontWeight={500}>{doc.fileName}</Typography>
        <Typography variant="caption" color="text.secondary">
          Preview not available for {cfg.label} files
        </Typography>
      </Box>
      <Button
        variant="outlined"
        size="small"
        startIcon={<OpenInNewIcon />}
        onClick={() => window.open(doc.fileUrl, '_blank')}
        sx={{ textTransform: 'none' }}
      >
        Open in new tab
      </Button>
    </Box>
  );
}

export const FilePreview: React.FC<FilePreviewProps> = ({ doc }) => {
  const cfg   = getFileIconConfig(doc.fileType);
  const isPdf = doc.fileType === 'application/pdf';
  const isImg = doc.fileType.startsWith('image/');
  console.log("doc=====",doc)
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2, gap: 1.5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flexShrink: 0 }}>
        <Box sx={{
          width: 44, height: 44, borderRadius: 2, flexShrink: 0,
          bgcolor: `${cfg.color}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isPdf
            ? <PictureAsPdfIcon sx={{ color: cfg.color, fontSize: 26 }} />
            : isImg
            ? <ImageIcon sx={{ color: cfg.color, fontSize: 26 }} />
            : <InsertDriveFileIcon sx={{ color: cfg.color, fontSize: 26 }} />
          }
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={600} noWrap sx={{ fontSize: 14 }}>
            {doc.fileName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.25 }}>
            <Chip label={cfg.label} size="small"
              sx={{ height: 18, fontSize: 10, bgcolor: `${cfg.color}15`, color: cfg.color, '& .MuiChip-label': { px: 0.75 } }} />
            {doc.fileSize && (
              <Typography variant="caption" color="text.secondary">{formatFileSize(doc.fileSize)}</Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
          <Tooltip title="Download">
            <IconButton size="small" onClick={() => {
              const a = document.createElement('a');
              a.href = doc.fileUrl; a.download = doc.fileName; a.target = '_blank'; a.click();
            }}>
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open in new tab">
            <IconButton size="small" onClick={() => window.open(doc.fileUrl, '_blank')}>
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Meta */}
      <Paper variant="outlined" sx={{ px: 1.5, py: 1, borderRadius: 1.5, flexShrink: 0 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          {[
            { label: 'File type', value: doc.fileType },
            { label: 'Size', value: doc.fileSize ? formatFileSize(doc.fileSize) : '—' },
            // { label: 'Uploaded', value: doc.createdAt ? timeAgo(doc.createdAt) : '—' },
            // { label: 'Modified', value: doc.updatedAt ? timeAgo(doc.updatedAt) : '—' },
          ].map(({ label, value }) => (
            <Box key={label}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>{label}</Typography>
              <Typography variant="caption" display="block" noWrap sx={{ fontSize: 11, fontWeight: 500 }}>{value}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      <Divider sx={{ flexShrink: 0 }} />

      {/* Preview area */}
      {isPdf
        ? <PdfPreview url={doc.fileUrl} />
        : isImg
        ? <ImagePreview url={doc.fileUrl} fileName={doc.fileName} />
        : <UnsupportedPreview doc={doc} />
      }
    </Box>
  );
};
