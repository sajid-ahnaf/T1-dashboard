import ClientsTable from '@/components/clients/ClientsTable';
import ContentWrapper from '@/layout/sidebar/ContentWrapper';
import React from 'react';

const ClientInfoPage = () => {
    return (
        <>
            <ContentWrapper breadCampTitle='Customers & Orders'>
               <ClientsTable/>
            </ContentWrapper>
        </>
    );
};

export default ClientInfoPage;