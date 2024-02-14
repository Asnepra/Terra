"use client";
import { useEffect, useState } from "react";
import { Metadata } from "next";
import { PlusCircleIcon, DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Menu } from "@/app/menu";
import { Sidebar } from "@/app/sidebar";
import { listenNowAlbums } from "./data/album";
import { AlbumArtwork } from "@/app/album-artwork";
import { LoadingSpinner } from "@/components/ui/loader";

import useSWR from "swr";

const fetchWithToken = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorRes = await res.json();
    const error = new Error();
    error.message = errorRes?.error;
    throw error;
  }
  return await res.json();
};

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

function checkUrlPatterns(url: string) {
  const patterns = [
    /ww\.mirrobox\.com/,
    /www\.nephobox\.com/,
    /freeterabox\.com/,
    /www\.freeterabox\.com/,
    /1024tera\.com/,
    /4funbox\.co/,
    /www\.4funbox\.com/,
    /mirrobox\.com/,
    /nephobox\.com/,
    /terabox\.app/,
    /terabox\.com/,
    /www\.terabox\.ap/,
    /terabox\.fun/,
    /www\.terabox\.com/,
    /www\.1024tera\.co/,
    /www\.momerybox\.com/,
    /teraboxapp\.com/,
    /momerybox\.com/,
    /tibibox\.com/,
    /www\.tibibox\.com/,
    /www\.teraboxapp\.com/,
  ];

  if (!isValidUrl(url)) {
    return false;
  }

  for (const pattern of patterns) {
    if (pattern.test(url)) {
      return true;
    }
  }

  return false;
}

export default function MusicPage() {
  const [fetchingInfo, setFetchingInfo] = useState(false);
  const [fileName, setFileName] = useState("Dummy File Name");
  const [fileSize, setFileSize] = useState("-1B");
  const [link, setLink] = useState("");
  const [err, setError] = useState("");
  const [disableInput, setdisableInput] = useState(false);

  const { data, error } = useSWR(
    () => (link ? `/api?data=${encodeURIComponent(link)}` : null),
    fetchWithToken
  );

  useEffect(() => {
    if (data || error) {
      console.log("data", data);
      setFetchingInfo(false);
      setFileName(data?.file_name ?? "Dummy File Name");
      setFileSize(data?.size ?? "-1B");
      setLink("");
    }
    if (err || error) {
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }, [data, error]);

  async function Submit() {
    setError("");
    setdisableInput(true);
    if (!link) {
      setError("Please enter a link");
      return;
    }
    if (!checkUrlPatterns(link)) {
      setError("Invalid Link");
      return;
    }

    setFetchingInfo(true);
    setFileName("Fetching...");
    setFileSize("Fetching...");
    setLink(link);
  }

  const startDownload = async () => {
    // Implement download logic
  };

  return (
    <>
      <div className="">
        <Menu />
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <Sidebar playlists={[]} className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-2 py-6 lg:px-8">
                  <div className="py-2 gap-4 md:gap-6 space-between flex items-center">
                    <Input
                      placeholder="Enter terrabox Url"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      disabled={fetchingInfo}
                    />
                    <div className="ml-auto mr-4">
                      <Button onClick={Submit} disabled={fetchingInfo}>
                        <PlusCircleIcon className="mr-2 h-4 w-4" />
                        Fetch Link
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between flex-col lg:flex-row">
                    <div className="space-y-1 ">
                      <h2 className="text-2xl font-semibold tracking-tight">
                        Fetching Information
                      </h2>
                      <p className="text-sm text-muted-foreground">Thumbnail</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="relative">
                    <ScrollArea>
                      <div className="flex grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                        {listenNowAlbums.map((album) => (
                          <AlbumArtwork
                            key={album.name}
                            album={album}
                            className="w-full"
                            aspectRatio="portrait"
                            width={250}
                            height={330}
                          />
                        ))}
                      </div>
                      <ScrollBar orientation="vertical" />
                    </ScrollArea>
                  </div>
                  <div className=" py-2 gap-x-2 md:gap-x-6 items-center flex grid-cols-3 ">
                    <Label className="text-sm md:text-lg">File Name</Label>
                    <Label className="text-sm md:text-lg line-clamp-1">
                      {fileName}
                    </Label>
                    <Label className="text-sm md:text-lg">File Size</Label>
                    <Label className="text-sm md:text-lg line-clamp-1">
                      {fileSize}
                    </Label>
                    <Button onClick={startDownload} disabled={fetchingInfo}>
                      {fetchingInfo ? (
                        <LoadingSpinner size={20} />
                      ) : (
                        <>
                          <DownloadIcon className="mr-2 h-4 w-4" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
