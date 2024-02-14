"use client";
import { useState } from "react";
import { Metadata } from "next";
import Image from "next/image";
import { PlusCircleIcon, DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Menu } from "@/app/menu";
import { Sidebar } from "@/app/sidebar";
import { playlists } from "@/app/data/playlist";
import { AlbumArtwork } from "@/app/album-artwork";
import { LoadingSpinner } from "@/components/ui/loader";
import { listenNowAlbums } from "./data/album";

export default function MusicPage() {
  const [fetchingInfo, setFetchingInfo] = useState(false);
  const [fileName, setFileName] = useState("Dummy File Name");
  const [fileSize, setFileSize] = useState("-1B");

  const fetchInformation = async () => {
    setFetchingInfo(true);
    //console.log("fetching called");
    // Implement your API call logic here
    // Once data is fetched, update fileName, fileSize, etc. state variables
    // Example:
    // const response = await fetch(yourApiEndpoint);
    // const data = await response.json();
    // setFileName(data.fileName);
    // setFileSize(data.fileSize);
    setFetchingInfo(false);
  };

  const startDovnload = async () => {};

  return (
    <>
      <div className="">
        <Menu />
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <Sidebar playlists={playlists} className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-2 py-6 lg:px-8">
                  <div className="py-2 gap-4 md:gap-6 space-between flex items-center">
                    <Input placeholder="Enter terrabox Url"></Input>
                    <div className="ml-auto mr-4">
                      <Button onClick={fetchInformation}>
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
                        {/* Render Album Artworks here */}

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
                    <Button disabled={fetchingInfo}>
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
