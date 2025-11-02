"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import RequestPageTemplate from "@/ui/components/templates/requestPage";
import { withAdminAuth } from '@/hoc/withAdminAuth';

const RequestsPage: React.FC = () => {
  return (
    <div>
      <div>
        <Link href="/" className="cursor-pointer inline-block">
          <Image
            src="/images/pysonlogo.png"
            alt="Decoration"
            width={200}
            height={200}
            priority
          />
        </Link>
      </div>

      {/* Contenido principal */}
      <div>
        <RequestPageTemplate />
      </div>
    </div>
  );
};

export default withAdminAuth(RequestsPage);
