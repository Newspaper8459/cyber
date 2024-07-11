import { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  FormControl,
  Button,
  TextField
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import app from "./css/app.module.scss";
import { SubmitHandler, useForm, Controller } from "react-hook-form";


function App() {
  const [itemList, setItemList] = useState<itemType[]>([]);

  const baseURL = "http://localhost:3000/";
  const get = async (): Promise<void> => {
    const res = await fetch(baseURL);
    const items = await res.json();
    console.log(items);

    setItemList(items);
  };

  const post = async (item: itemType) => {
    console.log(JSON.stringify(item));

    fetch(baseURL + "item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    })
      .then((res) => {
        if (res.status === 200) get();
        else console.log(res);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  type itemType = {
    name: string;
    quantity: number;
    unit: string | undefined;
  };

  useEffect(() => {
    get()

    return () => {

    }
  }, [])

  const japanese = {
    name: '名前',
    quantity: '個数',
    unit: '単位',
  }

  const onSubmit: SubmitHandler<itemType> = (data) => {
    // console.log(data)
    post(data);
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<itemType>();


  return (
    <div className={app.wrapper}>
      <form className={app.itemForm} onSubmit={handleSubmit(onSubmit)}>
        {["name", "quantity", "unit"].map((elem) => (
          <FormControl
            error={!!errors[elem as keyof itemType]}
            key={elem}
            fullWidth
          >
            <Controller
              control={control}
              name={elem as keyof itemType}
              defaultValue=""
              rules={{
                required: !(elem === "unit"),
                ...(elem === "quantity" && {
                  valueAsNumber: true,
                }),
              }}
              render={({ field, formState: { errors } }) => (
                <TextField
                  {...field}
                  // variant="standard"
                  fullWidth
                  required={!(elem === "unit")}
                  label={japanese[elem as keyof itemType]}
                  error={!!errors[elem as keyof itemType]}
                  helperText={errors[elem as keyof itemType]?.message as string}
                />
              )}
            />
          </FormControl>
        ))}
        <Button type="submit" variant="contained" sx={{}}>
          追加
        </Button>
      </form>
      <div className="item-list">
        <List>
          {itemList.map((item) => (
            <ListItem
              key={uuidv4()}
              secondaryAction={
                <IconButton edge="end" aria-label="comments">
                  <Close />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton role={undefined} dense>
                <ListItemIcon>
                  <Checkbox edge="start" />
                </ListItemIcon>
                <ListItemText
                  primary={`${item}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
}

export default App
