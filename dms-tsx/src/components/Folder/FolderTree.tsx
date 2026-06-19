// components/FolderTree.tsx

import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import FolderIcon from '@mui/icons-material/Folder';
import { useNavigate } from 'react-router-dom';

const folders = [
  {
    id: '1',
    name: 'Finance',
    children: [
      {
        id: '2',
        name: 'Invoices',
        children: [],
      },
    ],
  },
  {
    id: '3',
    name: 'HR',
    children: [],
  },
];

export default function FolderTree({
  selectedFolderId,
}: {
  selectedFolderId?: string;
}) {
  const navigate = useNavigate();

  const renderTree = (node: any) => (
    <TreeItem
      key={node.id}
      itemId={node.id}
      label={
        <>
          <FolderIcon
            fontSize="small"
            sx={{ mr: 1 }}
          />
          {node.name}
        </>
      }
      onClick={() =>
        navigate(`/folders/${node.id}`)
      }
    >
      {node.children?.map(renderTree)}
    </TreeItem>
  );

  return (
    <SimpleTreeView
      // selectedItems={
      //   selectedFolderId
      //     ? [selectedFolderId]
      //     : []
      // }
    >
      {folders.map(renderTree)}
    </SimpleTreeView>
  );
}