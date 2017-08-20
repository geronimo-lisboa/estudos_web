#include <itkImage.h>
#include <itkImageFileReader.h>
#include <string>
#include <string>
#include <sstream>
#include <vector>
#include <iterator>
#include <stdio.h>

template<typename Out>
void split(const std::string &s, char delim, Out result) {
	std::stringstream ss;
	ss.str(s);
	std::string item;
	while (std::getline(ss, item, delim)) {
		*(result++) = item;
	}
}

std::vector<std::string> split(const std::string &s, char delim) {
	std::vector<std::string> elems;
	split(s, delim, std::back_inserter(elems));
	return elems;
}

int main(int argc, char** argv)
{
	if(argc < 2)
	{
		std::cerr << argv[0] << " nome do arquivo" << std::endl;
		return EXIT_FAILURE;
	}
	//Carga
	std::string m_FileName = argv[1];
	typedef unsigned char                           ComponentType;
	typedef itk::RGBPixel< ComponentType >          InputPixelType;
	typedef itk::Image< InputPixelType, 2 > InputImageType;
	typedef itk::ImageFileReader< InputImageType >  ReaderType;
	ReaderType::Pointer reader = ReaderType::New();
	reader->SetFileName(m_FileName.c_str());
	reader->Update();
	InputImageType::Pointer loadedImage = reader->GetOutput();//aqui eu tenho a imagem
	//pra gerar o nome do raw de saida
	std::vector<std::string> elems;
	split(m_FileName, '.', std::back_inserter(elems));
	std::string binFileName = elems[0] + ".bin";
	//grava o bloco de bytes da imagem no disco.
	FILE* pFile;
	pFile = fopen(binFileName.c_str(), "wb");
	size_t sz = loadedImage->GetLargestPossibleRegion().GetNumberOfPixels() * 3 * sizeof(unsigned char);
	fwrite(loadedImage->GetBufferPointer(), sz, 1, pFile);
	fclose(pFile);
	return EXIT_SUCCESS;
}