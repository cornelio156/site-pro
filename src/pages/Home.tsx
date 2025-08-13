import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SettingsIcon from '@mui/icons-material/Settings';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import { useAuth } from '../services/Auth';
import VideoCard from '../components/VideoCard';
import { VideoService, Video, SortOption } from '../services/VideoService';
import { useSiteConfig } from '../context/SiteConfigContext';
import FeaturedBanner from '../components/FeaturedBanner';
import DatabaseSetupModal from '../components/DatabaseSetupModal';
import CredentialsStatus from '../components/CredentialsStatus';

// Skeleton card component for loading state
const VideoCardSkeleton: FC = () => {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      bgcolor: 'background.paper'
    }}>
      <Skeleton 
        variant="rectangular" 
        sx={{ width: '100%', paddingTop: '56.25%' }} 
        animation="wave" 
      />
      <CardContent>
        <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 1 }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" sx={{ width: '30%' }} />
          <Skeleton variant="text" sx={{ width: '20%' }} />
        </Box>
      </CardContent>
    </Card>
  );
};

const Home: FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  
  const { user } = useAuth();
  const { videoListTitle } = useSiteConfig();
  const videosPerPage = 12;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { videos: videoList, totalPages: pages } = await VideoService.getVideosWithPagination(
          page,
          videosPerPage,
          SortOption.NEWEST
        );
        
        setVideos(videoList);
        setTotalPages(pages);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, [user, page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render skeleton loaders during loading state
  const renderSkeletons = () => {
    return Array(videosPerPage).fill(0).map((_, index) => (
      <Grid item key={`skeleton-${index}`} xs={12} sm={6} md={4} lg={3}>
        <VideoCardSkeleton />
      </Grid>
    ));
  };

  const handleBannerError = (errorMsg: string) => {
    setError(errorMsg);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Banner de destaque */}
      <FeaturedBanner onError={handleBannerError} />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Status das Credenciais */}
        <CredentialsStatus />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          mb: 3
        }}>
          <Typography variant="h4" component="h2" gutterBottom>
            {videoListTitle || 'Featured Videos'}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            alignItems: 'center',
            alignSelf: { xs: 'flex-start', md: 'center' }
          }}>
            {/* Botão de setup da database - sempre visível para facilitar configuração inicial */}
            <Tooltip title="Configurar Base de Dados Appwrite">
              <Button
                onClick={() => setSetupModalOpen(true)}
                variant="outlined"
                color="secondary"
                size="small"
                sx={{ 
                  minWidth: 'auto', 
                  px: 1.5,
                  opacity: 0.7,
                  '&:hover': { opacity: 1 }
                }}
              >
                <SettingsIcon fontSize="small" />
              </Button>
            </Tooltip>
            
            <Button 
              component={RouterLink}
              to="/videos"
              variant="outlined"
              color="primary"
              endIcon={<ArrowForwardIcon />}
            >
              View All Videos
            </Button>
          </Box>
        </Box>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => setSetupModalOpen(true)}
                startIcon={<SettingsIcon />}
              >
                Configurar Base de Dados
              </Button>
            }
          >
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Grid container spacing={3}>
            {renderSkeletons()}
          </Grid>
        ) : videos.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            No videos available at the moment. Please check back later.
          </Alert>
        ) : (
          <>
            <Grid container spacing={3}>
              {videos.map((video) => (
                <Grid item key={video.$id} xs={12} sm={6} md={4} lg={3}>
                  <VideoCard video={video} />
                </Grid>
              ))}
            </Grid>
            
            {totalPages > 1 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 5,
                pt: 3,
                borderTop: '1px solid',
                borderColor: 'divider'
              }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}
      </Container>
      
      {/* Modal de setup da base de dados */}
      <DatabaseSetupModal 
        open={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
      />
    </Box>
  );
};

export default Home;
