import { Metadata } from "next";
import Image from "next/image";
import { PlusCircleIcon, DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { AlbumArtwork } from "@/app/album-artwork";
import { Menu } from "@/app/menu";
import { Sidebar } from "@/app/sidebar";
import { listenNowAlbums, madeForYouAlbums } from "@/app/data/album";
import { playlists } from "@/app/data/playlist";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Terra D App",
  description: "App tp dovnload the Video files vithout using App and adds.",
};

export default function MusicPage() {
  return (
    <>
      <div className="">
        <Menu />
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <Sidebar playlists={playlists} className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                  <div className="py-2 gap-4 md:gap-6 space-between flex items-center">
                    <Input placeholder="Enter terrabox Url"></Input>
                    <div className="ml-auto mr-4">
                      <Button>
                        <PlusCircleIcon className="mr-2 h-4 w-4" />
                        Fetch Information
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between flex-col lg:flex-row">
                    <div className="space-y-1 ">
                      <h2 className="text-2xl font-semibold tracking-tight">
                        Fetching Information
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Getting File
                      </p>
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
                  <div className="py-2 gap-4 md:gap-6 space-between flex items-center">
                    <div className="mr-4">
                      <Button>
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
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
