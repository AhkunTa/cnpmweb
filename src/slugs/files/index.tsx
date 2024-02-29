'use client';
import { CodeViewer } from '@/components/CodeViewer';
import { FileTree } from '@/components/FileTree';
import { DynamicIDEComponent ,} from '@/components/IDE/DynamicIDEComponent';
// import { IDE } from '@/components/IDE/IDE';
import { Sidebar } from '@/components/Sidebar';
import { IDEModeName } from '@/hooks/useCodeBlitz';
import { useDirs, File } from '@/hooks/useFile';
import { usePathState } from '@/hooks/usePathState';
import { PageProps } from '@/pages/package/[...slug]';
import { Spin } from 'antd';
import { useState } from 'react';

const Viewer = ({ manifest, version, IDEMode }: PageProps) => {
  const [_selectedFile, setSelectedFile] = useState<File | undefined>();
  const [path, setPath] = usePathState(
    `/package/${manifest.name}/files/*?version=${version || 'latest'}`,
  );

  const { data: rootDir, isLoading } = useDirs({
    fullname: manifest.name,
    spec: version || 'latest',
  });

  let selectedFile = _selectedFile || { path: `/${path || 'package.json'}`, type: 'file' };

  const onSelect = (file: File) => {
    setSelectedFile(file);
    setPath(file.path);
  };

  if (isLoading) {
    return (
      <Spin
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    );
  }

  return (
    <div style={{ display: 'flex', marginTop: -16, minHeight: '100%' }}>
      {IDEMode === IDEModeName.IDE ? (
        <DynamicIDEComponent rootDir={rootDir} pkgName={manifest.name} spec={version} />
      ) : (
        <div style={{ display: 'flex', width: '100%' }}>
          <Sidebar>
            <FileTree rootDir={rootDir} selectedFile={selectedFile} onSelect={onSelect} />
          </Sidebar>
          <CodeViewer selectedFile={selectedFile} pkgName={manifest.name} spec={version} />
        </div>
      )}
    </div>
  );
};

export default Viewer;
