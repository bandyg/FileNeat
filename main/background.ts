import path from 'path';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import { app, ipcMain, IpcMainEvent, dialog } from 'electron';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`);
});

ipcMain.on('check-file-exists', (event: IpcMainEvent, filePath: string) => {
  console.log(`main proc check-file-exists ${filePath}`);
  dialog
    .showOpenDialog({ properties: ['openFile', 'multiSelections'] })
    .then((result: any) => {
      event.returnValue = result;
    })
    .catch((err: Error) => {
      event.returnValue = err.message;
    });
  //event.reply('file-exists-response', false);
});

ipcMain.on('open-folder-dialog', (event: IpcMainEvent) => {
  dialog
    .showOpenDialog({ properties: ['openDirectory'] })
    .then((result: any) => {
      console.log(result);
      event.reply('folder-dialog-response', result); // Send the file paths back
    })
    .catch((err: Error) => {
      console.log(err.message);
      event.reply('folder-dialog-response', { error: err.message }); // Send error message back
    });
});

// ipcMain.handle('read-folder', async (_, folderPath) => {
//   const readItems = async (dir) => {
//     const items = await readdir(dir, { withFileTypes: true });
//     return Promise.all(
//       items.map(async (item) => ({
//         name: item.name,
//         isDirectory: item.isDirectory(),
//         path: path.join(dir, item.name),
//         children: item.isDirectory() ? await readItems(path.join(dir, item.name)) : [],
//       }))
//     );
//   };
//   return await readItems(folderPath);
// });

// ipcMain.handle('process-organization', async (_, { structure, rules }) => {
//   //   const openai = new OpenAI({
//   //     apiKey: process.env.OPENAI_API_KEY,
//   //   });
//   //   const prompt = `根据以下规则整理文件结构：
//   // 规则：${rules.join(', ')}
//   // 当前结构：${JSON.stringify(structure)}
//   // 请返回包含以下字段的JSON：
//   // - newStructure: 整理后的虚拟结构
//   // - shortcuts: 快捷方式创建数组（包含originalPath和shortcutPath）`;
//   //   const completion = await openai.chat.completions.create({
//   //     messages: [{ role: 'user', content: prompt }],
//   //     model: 'gpt-3.5-turbo',
//   //     response_format: { type: 'json_object' },
//   //   });
//   //   return JSON.parse(completion.choices[0].message.content);
// });

// ipcMain.handle('check-file-exists', async (_, filePath: string) => {
//   return fs.existsSync(filePath);
// });
