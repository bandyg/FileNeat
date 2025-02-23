'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { FolderOpen, Settings2, PlayCircle } from 'lucide-react';

declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
  }
}

export default function FilesNeat() {
  const [folderPath, setFolderPath] = useState('');
  const [rules, setRules] = useState({
    byFileType: false,
    byDate: false,
    byProject: false,
    autoRename: false,
  });
  const toast = useToast();

  const handleFolderSelect = async () => {
    try {
      if ('showDirectoryPicker' in window) {
        const dirHandle = await window.showDirectoryPicker();
        setFolderPath(dirHandle.name);
        toast({
          title: 'Folder selected',
          description: `Selected folder: ${dirHandle.name}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        const input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;

        input.onchange = (e) => {
          const files = (e.target as HTMLInputElement).files;
          if (files && files.length > 0) {
            const path = files[0].webkitRelativePath.split('/')[0];
            setFolderPath(path);
            toast({
              title: 'Folder selected',
              description: `Selected folder: ${path}`,
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
          }
        };

        input.click();
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
      toast({
        title: 'Error',
        description: 'There was an error selecting the folder. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleStartOrganizing = () => {
    if (!folderPath) {
      toast({
        title: 'No folder selected',
        description: 'Please select a folder first',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!Object.values(rules).some(Boolean)) {
      toast({
        title: 'No rules selected',
        description: 'Please select at least one organization rule',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: 'Starting organization',
      description: 'Your files are being organized...',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box minH='100vh' bg='gray.50' py={8}>
      <Container maxW='container.sm'>
        <VStack
          spacing={8}
          bg='white'
          p={8}
          borderRadius='xl'
          boxShadow='sm'
          position='relative'
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            bgGradient: 'linear(to-r, purple.400, blue.500)',
            borderTopRadius: 'xl',
          }}
        >
          <VStack spacing={2}>
            <Heading size='lg' textAlign='center'>
              智能文件整理助手
            </Heading>
            <Text color='gray.500' fontSize='md'>
              Smart File Organization Assistant
            </Text>
          </VStack>

          <Button
            leftIcon={<FolderOpen />}
            width='full'
            size='lg'
            onClick={handleFolderSelect}
            colorScheme='purple'
            variant='outline'
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
            transition='all 0.2s'
          >
            <VStack spacing={0} align='center'>
              <Text>选择文件夹</Text>
              <Text fontSize='xs' color='gray.500'>
                Select Folder
              </Text>
            </VStack>
          </Button>

          {folderPath && (
            <Box w='full' p={4} bg='purple.50' borderRadius='md' borderWidth={1} borderColor='purple.200'>
              <Text fontSize='sm' color='purple.700'>
                Selected: {folderPath}
              </Text>
            </Box>
          )}

          <VStack w='full' spacing={6} align='start'>
            <Flex align='center' gap={2}>
              <Settings2 size={20} />
              <VStack align='start' spacing={0}>
                <Text fontSize='lg' fontWeight='semibold'>
                  整理规则:
                </Text>
                <Text fontSize='sm' color='gray.500'>
                  Organization Rules:
                </Text>
              </VStack>
            </Flex>

            <Stack spacing={4} w='full'>
              {[
                {
                  key: 'byFileType',
                  zh: '按文件类型分类',
                  en: 'Organize by file type',
                },
                {
                  key: 'byDate',
                  zh: '按日期整理',
                  en: 'Organize by date',
                },
                {
                  key: 'byProject',
                  zh: '按项目分类',
                  en: 'Organize by project',
                },
                {
                  key: 'autoRename',
                  zh: '自动重命名重复文件',
                  en: 'Auto rename duplicate files',
                },
              ].map((rule) => (
                <Checkbox
                  key={rule.key}
                  isChecked={rules[rule.key as keyof typeof rules]}
                  onChange={(e) =>
                    setRules((prev) => ({
                      ...prev,
                      [rule.key]: e.target.checked,
                    }))
                  }
                  colorScheme='purple'
                  size='lg'
                >
                  <VStack align='start' spacing={0}>
                    <Text>{rule.zh}</Text>
                    <Text fontSize='xs' color='gray.500'>
                      {rule.en}
                    </Text>
                  </VStack>
                </Checkbox>
              ))}
            </Stack>
          </VStack>

          <Divider />

          <Button
            leftIcon={<PlayCircle />}
            width='full'
            size='lg'
            onClick={handleStartOrganizing}
            colorScheme='purple'
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
            transition='all 0.2s'
          >
            <VStack spacing={0} align='center'>
              <Text>开始整理</Text>
              <Text fontSize='xs'>Start organizing</Text>
            </VStack>
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}
